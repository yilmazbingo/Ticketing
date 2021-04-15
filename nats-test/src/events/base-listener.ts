import { Subjects } from "./subjects";
import { Message, Stan } from "node-nats-streaming";

interface Event {
  subject: Subjects;
  data: any;
}

// for any class that inhertis this, has to pass T as Event type
export abstract class Listener<T extends Event> {
  // abstract properties must be defined by subclass
  // subject referst to event in NATS
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  // msg refers to event in NATS
  abstract onMessage(data: T["data"], msg: Message): void;
  // we defined but have not initialized
  // we cannot modify this inside subclass
  private client: Stan;
  // subclass can define if it wants to. private can be accessed by only this class
  protected ackWait = 5 * 1000;
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        // By default, anytime an event is received by subscription, it automatically acknoldges that "Hey we received the event" and if saving our event to db fails, we lose the event and we dont get some follow up opportunity to process it
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
    );
  }
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`message received: ${this.subject}/ ${this.queueGroupName} `);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

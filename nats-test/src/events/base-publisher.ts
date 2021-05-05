import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

// dont forget. subject refers to channel in nats
interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  // each publisher class has to implement abstract properties or methods
  abstract subject: T["subject"];
  private client: Stan;
  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event Published to subject:", this.subject);
        // then listens for this. if it was resolve(sth), sth would be passed to then block
        resolve();
      });
    });
  }
}

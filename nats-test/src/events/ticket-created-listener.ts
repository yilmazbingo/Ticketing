import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // we still have pass type here to tell ts that we are not going to change the type
  //   subject:Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data", data);
    console.log(data.id);
    console.log(data.price);
    // if everything goes correctly we ack NATS.
    msg.ack();
  }
}

import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@yilmazcik/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

//  we save the ticket created in orders not to make a sync communication with Ticketsrvice
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // if I do not initialize value, I have to initialize in constructor
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //   readonly subject: Subjects.TicketCreated; this is same above but it has to be initialized inside constructor
  // same service instances join queue groups. this ensures that anytime an event comes to the channel
  // this event is going to be sent one of the members
  queueGroupName = queueGroupName;
  // ack is the most important property of Message
  // ack sends message to nats that we successfully received the event
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}

// whenever we replicate data between services we have to make sure we use consistent id between them.

// export interface TicketCreatedEvent {
//   subject: Subjects.TicketCreated;
//   data: {
//       id: string;
//       version: number;
//       title: string;
//       price: number;
//       userId: string;
//   };
// }

import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@yilmazcik/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  //   readonly subject: Subjects.TicketUpdated; same as above but has to be initialized in constructoe
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    // const ticket = await Ticket.findById(data.id);
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not foumd");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    // after ticket is saved, mongoose-update-if-current will increase the version number
    msg.ack();
  }
}

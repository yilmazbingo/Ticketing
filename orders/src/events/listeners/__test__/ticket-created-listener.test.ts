import { TicketUpdatedEvent } from "@yilmazcik/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 23,
    title: "concert",
  });
  await ticket.save();
  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "Concet",
    price: 12,
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    //  we need to implement only ack(). we dont need other methods
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves ticket", async () => {
  const { listener, data, msg, ticket } = await setup();
  //   listener receives data, builds ticket and saves it
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  // write assertions to make sure a ticket was created
  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});
it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object +message object
  await listener.onMessage(data, msg);
  // write assertios to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 23;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    // we use this not to throw error. otherwise test suit would fail
  }
  expect(msg.ack).not.toHaveBeenCalled();
});

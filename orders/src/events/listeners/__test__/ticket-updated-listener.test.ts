import { TicketCreatedEvent } from "@yilmazcik/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concet",
    price: 12,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    //  we need to implement only ack(). we dont need other methods
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves ticket", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object +message object
  //   listener receives data, builds ticket and saves it
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object +message object
  await listener.onMessage(data, msg);
  // write assertios to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

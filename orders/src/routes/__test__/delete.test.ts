import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket, OrderStatus } from "../../models";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket model
  const ticket = Ticket.build({
    title: "Concert",
    price: 32,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const user = global.signin();

  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
  // make a request to cancel the order
  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user);

  // expect to make sure that ticket is cancelled
  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

// it.todo("emits a order cancelled event");

it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 32,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const user = global.signin();

  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
  // make a request to cancel the order
  await request(app).delete(`/api/orders/${order.id}`).set("Cookie", user);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

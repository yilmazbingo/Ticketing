import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models";
import mongoose from "mongoose";
const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  // Create 3 tickets.
  const ticket1 = await buildTicket("Concert1", 22);
  const ticket2 = await buildTicket("concert", 40);
  const ticket3 = await buildTicket("concert3", 10);

  const userOne = global.signin();
  const userTwo = global.signin();
  // create one order as user# 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);
  // create two orders as user# 2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticket2.id });
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticket3.id });

  // then we are going to fetches all the orders for specifically user#2

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // make sure we only got the orders for User#2.
  console.log(response.body);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});

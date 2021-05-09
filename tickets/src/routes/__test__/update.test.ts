import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const id = new mongoose.Types.ObjectId().toHexString();

it("returns 404 if the provided id does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "Ss", price: 21 })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "Ss", price: 21 })
    .expect(401);
});

it("returns 401 if the user attemps to update does not own ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "creating", price: 12 });
  // inside test/setup.ts we set that each user has different id.
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "updating", price: 22 })
    .expect(401);
});
it("returns 404 if the user provides an invalid title or price", async () => {
  // i need to keep the id of user who made this request
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "sa", price: 32 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 32 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "ewdad", price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  // creating has statuc code 201
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({ title: "dada", price: 12 })
    .expect(201);

  // updating has status code of 200
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "dadabb", price: 21 })
    .expect(200);

  const newResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();
  expect(newResponse.body.title).toEqual("dadabb");
  expect(newResponse.body.price).toEqual(21);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "dadd", price: 32 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 322 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects update if the ticket is reserved", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "sa", price: 32 });

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 32 })
    .expect(400);
});

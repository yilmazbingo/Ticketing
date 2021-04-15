import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if the ticket is not found", async () => {
  // if we did not define route handler, it would pass
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
  // .expect(404); to get the console.log remover the expectation
  // in our error logic, we said if it is not Custom error , throw "somehting went wrong" thats waht we got here
  // error: "Cast to ObjectId failed for value" that we did not pass a valid id construction
  // console.log(response.body);
});

it("returns the ticket if the ticket is found", async () => {
  // we could build test and save it first. this also valid option
  //Ticket.build({}), ticket.save()
  const title = "concert";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

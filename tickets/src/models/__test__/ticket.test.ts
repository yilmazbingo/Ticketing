import { Ticket } from "../ticket";
import mongoose from "mongoose";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 12,
    userId: "12",
  });
  // save the ticket to db
  //    in this case mongoose-if-curretn will assign a version number
  await ticket.save();
  // fetch the ticket twice.
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the ticekts we fetched.
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 22 });

  // save the first fecthed ticket
  await firstInstance?.save();

  // save the seond fetched ticket and expect an error
  //   await secondInstance?.save();

  //   expect(secondInstance?.save()).rejects.toThrow();

  try {
    await secondInstance?.save();
  } catch (error) {
    expect(error).toBeInstanceOf(mongoose.Error.VersionError);
  }
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 32, userId: "123" });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);

  // if we save same record another time, version number gets incremented by 1.
});

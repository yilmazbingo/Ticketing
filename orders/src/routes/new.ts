import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
// express validator will set an error in incomin request
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@yilmazcik/common";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order, Ticket } from "../models";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    // ticketId is monngoose. we could use mongoose.types.id but this is not good because we make assumption that mongodb is used as db. but what if somehting else was used.
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // reserved ticket is associated with an order and order status must have a status of not cancelled.
    // Make sure that ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    // mongoose can make sanitation with pre'save" hooks. so we should emit the saved version of ticket.
    // .client will call getter
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      // when date object is turned into a string, it will be turned representing the current time zone that is in.
      // whenever we share timestamp across different services, we want to communicate with a time zone agnostic way
      // toISOString() provide UTC timestamp.
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };

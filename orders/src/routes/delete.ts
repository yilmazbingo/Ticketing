import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import {
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
} from "@yilmazcik/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,

  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    // deletin http request is 204. but since we are updating we should not send 204
    res.send(order);
  }
);

export { router as deleteOrderRouter };

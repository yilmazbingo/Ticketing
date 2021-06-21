import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@yilmazcik/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found");
    }
    if (order.status === OrderStatus.Complete) {
      // if ordered paid we cannot cancel the order
      return msg.ack();
    }
    // order object has reference to ticket
    order.set({
      status: OrderStatus.Cancelled,
      // we do not have to do is because it sis handeled in model ticket.ts
      // ticket: null
    });

    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

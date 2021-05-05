import { Subjects, Publisher, OrderCancelledEvent } from "@yilmazcik/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

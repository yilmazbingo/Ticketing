import { Publisher, Subjects, OrderCreatedEvent } from "@yilmazcik/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

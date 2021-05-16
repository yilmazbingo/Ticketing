import { Publisher, Subjects, PaymentCreatedEvent } from "@yilmazcik/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

import { Publisher, Subjects, TicketUpdatedEvent } from "@yilmazcik/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

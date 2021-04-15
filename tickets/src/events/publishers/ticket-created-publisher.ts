import { Publisher, Subjects, TicketCreatedEvent } from "@yilmazcik/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

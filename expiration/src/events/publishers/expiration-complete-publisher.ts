import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@yilmazcik/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

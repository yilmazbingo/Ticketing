## ORDER SERVICE

- listens for "ticket:created" event. When Ticket Service creates a ticket, we get that event in Order Service and for consistency we have to make sure that we store this ticket in Order Service with the original id, so we can look up for it. When we replicate data accross services we make sure that we are using identical or consistent ID between them.
-
- version property in tickets ensures that we do not process events twice or out of order. One way to solve events go out of order was to make use of version. If Ticket service emits a series of events all about one kind of ticket beind updated from 10 to 20, from 20 to 30. We assume that these events might flow into our order service or other services in a very particular order. As we when we talk about NATS, it is entirely possible that these events will end up going over to Order SErvide and copletely in jumbled order. We really cannot rely upon the order of events coming into our order service correctly. Everytime we make a change to a ticket, we update the version number inside Ticket service, and ticket service will emit an events and inside of that event we are going to print out that version number.
- order has userId, status, expiresAt and ticketId
- order service listens for Event ticket:created and Event ticket:updated

- Whenever we replicate data between services, we make sure we have same consistend id. For example if we get ticket:created event from Ticket service to Order service, Order service has to save the ticket witht the same id. But in mongoodb, id is stored as "\_id". And we save the data wit manual "id", mongodb will still create "\_id" so we end up having "id" and "\_id" property inside of ticket collection.

## Order Service

- Order Service will publish "order:created" and "order:cancelled"
- Payment Service needs to know there is going to be some new order and its user might attempt to submit payment. Payment Service will receive the id of service and it will expect a paymnet to that orderId. Payment service also know how much that order costs. Order itself does not know how much it costs. It is the embedded tickets inside the order that is going to tell us how much the order needs to be paid for. "order:created" will be also sent to the Expiration Service so we can start up the timer window. Order Service has expiration time already marked on it.
  Ticket Service also has to know when the order was created. Becauase Ticket Service needs to lock down a ticket and prevent editing. For example, If a user buys a ticket for 20 dollars and 2 minutes after seller can change the price to 200 dollars. We want to prevent this happening. Once an order has been created and a ticket has been reserved, we need to somehow make sure that ticket cannot be edited.
- "order:cancelled" is going to unreserve the ticket from the ticket service. Pyment Service will reject any further payments for this order.

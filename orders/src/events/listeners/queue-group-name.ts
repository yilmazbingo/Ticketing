// If I have multiple instances of orders-service and they are subscibed to a channel. I need to make sure that I send the event to only one of them.
// instances will be part of a queueGroup and streaming service will send the event to only one of instances
export const queueGroupName = "orders-service";

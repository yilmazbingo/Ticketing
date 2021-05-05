Payments service listens for "order:created" and "order:cancelled" events. We create "Orders" models and save the incoming data in mongodb.

- "version" property is used to process all different events related to an order in the correct order.

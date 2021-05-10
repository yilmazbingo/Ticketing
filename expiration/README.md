This service has only job: It is going to listen for order-created-event coming in. After specific timer, however how long we set up, expiration service will publish "expiration-complete" event. The goal is to tell Order Serice that one of the orders has expired.

When expireation service receives "order-created-event", inside this event "expiresAt" is already set. Expiration Service will be wathing this this property.

- We could not use setTimeOut because timer is stored in memory. If Expiration Service restarts for any reason, all the timers that we have been running are going to be lost.
- we are going to use the "bull.js" library. It allows us essentially setup a timer and store it in redis which is in-memory database.

## Set up Redis

- "infra/k8s" configure "expiration-redis-depl.yaml"

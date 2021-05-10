import Queue from "bull";

interface Payload {
  orderId: string;
}

// this will publish the Job to redis server
export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// job is simmilar to msg in nats. job is not actual data. Instead it is an object that wraps up our data and some information about job itself.
expirationQueue.process(async (job) => {});

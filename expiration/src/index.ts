import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS client id must be defined!");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS Cluster Id must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS url must be defined");
  }

  try {
    // url will the service that governing this deployment
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (e) {
    console.error(e);
  }
};

start();

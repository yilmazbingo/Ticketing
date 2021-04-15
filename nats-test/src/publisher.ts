import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
// clear() will remove all console populated by the import statement
console.clear();

// client or stan. nats backward
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });
// client will emit connect event
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher
      .publish({
        id: "123",
        title: "concert",
        price: 20,
      })
      .then((a) => console.log("what i got from resolve()", a));
  } catch (e) {
    console.error(e);
  }

  // // we cannot directly share js object, we have to convert it to the JSON
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
// nats is running inside k8s cluster. so we have no access from outside. we set port forwarding

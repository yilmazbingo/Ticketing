import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

// NATS does not accept duplicate clientId's. So we randomly generate it
// nats server is available inside kubernetes cluster, by default we do not have direct access to it.
// we are trying to access some program running inside cluster.
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connceted to NATS");
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});
// SIGNINT= interrupt, SIGTERM: terminate
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

//Abstract classes are mainly for inheritance where other classes may derive from them. We cannot create an instance of an abstract class.

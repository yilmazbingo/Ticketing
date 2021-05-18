// import nats, { Stan } from "node-nats-streaming";

// // Singleton class

// class NatsWrapper {
//   // we are not going to define inside a constructor. we will define when we connect
//   //   ts wants us to immediately initalize in same line or inside the constructor
//   // ? telss that client might be undefined some period of time
//   // we have to mock this in test environment
//   private _client?: Stan;
//   get client() {
//     if (!this._client) {
//       throw new Error("Cannot access to NATS client before connecting");
//     }
//     return this._client;
//   }
//   connect(clusterId: string, clientId: string, url: string) {
//     //   clusterId is provided in config file
//     this._client = nats.connect(clusterId, clientId, { url });
//     return new Promise<void>((resolve, reject) => {
//       this.client.on("connect", () => {
//         console.log("Connected to NATS");
//         resolve();
//       });
//       this.client.on("error", (err) => {
//         reject(err);
//       });
//     });
//   }
// }

// export const natsWrapper = new NatsWrapper();
import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();

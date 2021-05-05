This service responsible for retrieve all tickets, create a ticket and update a ticket. It will have its own copy of mongodb.

### Adding environment variable for mongo instance

- Write the env variable in "tickets-depl.yaml"

```
spec:
      containers:
        - name: tickets
          image: kalinicovic/tickets
          env:
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
            - name: MONGO_URI
              value: "mongodb://tickets-mongo-srv:27017/tickets"

```

- set the mongo conenction uri:

```js
await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
```

## access this service from postman

Before using postman, we have to expose access to this ticket service. We have to update ingress-nginx file to tell it take requests to "api/tickets" and forward it to our ticket service.

in "infras/k8s/ingress-srv.yaml":

```js
- path: /api/tickets/?(.*)
            backend:
              service:
                name: tickets-srv
                port:
                  number: 3000
```

## NATS client in ticket service

We cannot use NATS the way how we use mongoose, importing it anywhere and communicate with databse.

```js
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });
```

When we connect to mongoose, mongoose internally keeps a record of all the different connections that exist. So after we connect to mongodb `mongoose.connect()`, we can use this instance in any file. Nats is different. When we connect to NATS, there is no internal connection or internal object keeping track of that connection inside of the NATS library. Instead when we call `nats.connect`, it directly returns to us the client so this client, we need to somehow manually share among all the different files.

If we initialize nats client in index.ts, that will be used in new.ts, which will be registererd in app.ts and app.ts will be used in index.ts. We are essentially creating **CYLICAL IMPORT** or **CYCLICAL DEPENDENCY**. Circular dependencies are usually an indication of bad code design, and they should be refactored and removed if at all possible.

**Solution**
create "nats-client-ts" and initalize "client" here. this client will be **SINGLETON**. we are going to try to build somehting similar to mongoose. index.ts will import that

## Graceful shutdown

we do not want our nats client cause entire proce exit. this is wrong

```js
this._client.on("close", () => {
  console.log("Nats connection closed");
  process.exit();
});
```

we do not ever want some method is going to suddenly cause the entire program exit. bad design.
we are going to do the exit command from inside index.ts

## Database Transaction:

A lot of databases implement transaction which alows us to say there is a set of changes that we want to make to our database. If any of those changes fail, do not make any of the changes.

## Testing nats client

Inside test files since we did not initialize the nats client, test will fail. Jest redirect import statements while we are running our application in the test environment. At some point in time , new route handler attemps to import natsWrapper file, we are going to get "jest" to intercept that import statements. Instead of importing real natsWrapper, jest will import fake copy of NATS client. We are not going to connect to NATS server.
**Redirecting Imports**

- find the file
- in the same directory, create a folder "**mocks**". in the src directory
- in **mocks** create a file with the identical name to the file that we want to fake.
- inside that file, write a fake implementation
- tell jest to use that fake file inside our test file.
- in test environemnt, new.test.ts and update.test.ts will beusing thsi fake connection
  ```js
  jest.mock("../../nats-wrapper");
  ```
  Any module that we use inside test environment, if they import "natsWrapper", jest will redirect that import and will be using mock of that file.

## Fake Implementation

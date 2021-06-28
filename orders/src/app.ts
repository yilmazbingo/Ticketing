import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@yilmazcik/common";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";
const app = express();
// traffic is proxied to our application through nginx-ingress. express does not trust proxy
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // this saying use only for https connections
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

// app.all will be watching for any type of request to any route
// when we mark a func with "async", it no longer returns a value, instead it returns a promise thats is going to resolve with some value in the future even we throw an error inside.
// this method works but this is specific to express.
//           app.all("*", async (req, res, next) => {
//                 next(new NotFoundError());
//           });
// we assume other enginner does not know about express
app.all("*", async (req, res, next) => {
  // express-async-errors will help this error to be resolved without next()
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

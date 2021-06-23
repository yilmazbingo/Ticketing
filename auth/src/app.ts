import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@yilmazcik/common";

const app = express();

// traffic is proxied to our application through ingress-nginx. express does not trust proxy
app.set("trust proxy", true);
app.use(json());
// cookie-session will create req.session object.  any information we store on this object will be automatically serialized by cookie session and stored inside the cookie.
app.use(
  cookieSession({
    // this will not encrypt. easier for different backend servers. we store jwt
    signed: false,
    // this saying use only for https connections
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
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

import express, { Response, Request } from "express";
import { currentUser } from "@yilmazcik/common";
const router = express.Router();

// react app cannot directly look into the cookie and inspect if the user is signed in or not.
router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    // if req.currentUser is not defined it will send undefined. we dont want it. we send "null
    console.log("request to api/users/currentuser", req.currentUser);
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };

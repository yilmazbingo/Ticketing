import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
// validationResult is going to inspect the req and pull out any infromation it was appended to the req during this validation step. "body" will append "error" to the req and "validationResult" will look at that
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@yilmazcik/common";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    try {
      const user = User.build({ email, password });
      // Password is hashed in User model with pre "save" hook
      await user.save();
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        // when u decode the jwt, it will ask for this key
        // "!" tels ts that we already checked this.
        process.env.JWT_KEY!
      );

      // req.session.jwt=userJwt ts gives warning. to circumvent this add it in a object
      // this is base 64 encoded. we need to decode this to extract the jwt. this is the returned value
      // {"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTRlMDc1ZTNmYThhMDAxOGE2NTA3YyIsImVtYWlsIjoiZHNzamtta2xpZEBob3RtYWlsLmNvbSIsImlhdCI6MTYwMzU5MjMwOX0.D_601ooPWojNyjE9IoUpNV-8jziV136aTnTXijbf_i4"}
      // anyone can see the info inside the jwt but cannot alter
      req.session = { jwt: userJwt };
      // anytime we receive this token inside another service, other services need to get access to the signing key. this is the only way to verify that token is valid.
      res.status(201).send(user);
    } catch (e) {
      throw new BadRequestError("Invalid credentials");
    }
  }
);

export { router as signupRouter };

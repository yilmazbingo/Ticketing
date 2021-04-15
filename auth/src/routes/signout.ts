import express from "express";
const router = express.Router();

//  we are going to send back a header that is going to tell the user's browser to dump all the information inside that cookie.
router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };

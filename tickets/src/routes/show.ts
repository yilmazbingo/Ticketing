import express, { Request, Response } from "express";
import { NotFoundError } from "@yilmazcik/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  // default status is 200
  res.send(ticket);
});

export { router as showTicketRouter };

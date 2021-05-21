import express, { Request, Response } from "express";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // find all the tickets that do not have the corresponding order.
  // if tickets has orderId, means it is sold or reserved
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

export { router as indexTicketRouter };

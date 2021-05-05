import express, { Request, Response } from "express";
import { body } from "express-validator";
// express validator will set an error in incomin request
import { requireAuth, validateRequest } from "@yilmazcik/common";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    /*Better approach would be we save ticket and event to db. then nats would be watching for the database event collection. imagine user deposits money, it is saved into transaction history but if publishing fails or nats is down, his account balance would be off*/
    await ticket.save();
    // mongoose can make sanitation with pre'save" hooks. so we should emit the saved version of ticket.
    // .client will call getter
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };

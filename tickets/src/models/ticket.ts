import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// we changed the __v to version down below
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: {
      type: String,
      required: true,
    },
    // when a ticket is created, we make follow up request to see the status of ticket. if reserved or not
    // it is not required because when it was first created, there would be no order associated with.
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      // ret is returnded obj
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// this has to above ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
// so we can use this even in test environment
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

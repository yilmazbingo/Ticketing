import mongoose from "mongoose";
// this is gonna make sure we always process all of our differents in the correct order
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@yilmazcik/common";

interface OrderAttrs {
  id: string;
  version: number;
  price: number;
  userId: string;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  price: number;
  userId: string;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  // version property will be maintained automatically by the mongoose update-if-current plugin
  {
    // version: { type: Number, required: true },
    price: { type: Number, required: true },
    userId: {
      type: String,
      required: true,
    },
    status: { type: String, required: true },
  },
  {
    toJSON: {
      // ret is returned obj
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// this will mongoose do not use "__v" flag
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
// so we can use this even in test environment
orderSchema.statics.build = (attrs: OrderAttrs) => {
  // when we receive order:created event, we will save that id, in our database here.
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };

import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  selectedColor: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    name: String,
    hexCode: String,
  },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: {
    type: [ItemSchema],
    required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "FULFILLED", "CANCELLED"],
    default: "PENDING",
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "CREDIT_CARD"],
    default: "CREDIT_CARD",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "REFUNDED"],
    default: "PENDING",
  },
}, {
  timestamps: true,
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;

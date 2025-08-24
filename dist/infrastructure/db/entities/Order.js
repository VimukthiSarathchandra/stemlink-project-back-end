"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    selectedColor: {
        _id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Color",
        },
        name: String,
        hexCode: String,
    },
});
const OrderSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    items: {
        type: [ItemSchema],
        required: true,
    },
    addressId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map
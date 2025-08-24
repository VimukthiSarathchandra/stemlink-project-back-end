"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_1 = require("../application/payment");
exports.paymentsRouter = express_1.default.Router();
exports.paymentsRouter.route("/create-checkout-session").post(payment_1.createCheckoutSession);
exports.paymentsRouter.route("/session-status").get(payment_1.retrieveSessionStatus);
exports.paymentsRouter.route("/manual-update-order/:orderId").post(payment_1.manuallyUpdateOrderStatus);
//# sourceMappingURL=payment.js.map
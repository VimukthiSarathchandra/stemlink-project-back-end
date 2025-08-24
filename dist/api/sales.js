"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRouter = void 0;
const express_1 = __importDefault(require("express"));
const sales_1 = require("../application/sales");
const authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
exports.salesRouter = express_1.default.Router();
exports.salesRouter.route("/dashboard").get(authentication_middleware_1.default, sales_1.getSalesData);
//# sourceMappingURL=sales.js.map
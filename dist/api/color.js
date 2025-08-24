"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const color_1 = require("../application/color");
const authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
const authorization_middleware_1 = require("./middleware/authorization-middleware");
const colorRouter = express_1.default.Router();
colorRouter.get("/", color_1.getAllColors);
colorRouter.post("/", authentication_middleware_1.default, authorization_middleware_1.isAdmin, color_1.createColor);
exports.default = colorRouter;
//# sourceMappingURL=color.js.map
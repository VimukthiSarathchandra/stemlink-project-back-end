"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const express_1 = require("@clerk/express");
const forbidden_error_1 = __importDefault(require("../../domain/errors/forbidden-error"));
const isAdmin = (req, res, next) => {
    const auth = (0, express_1.getAuth)(req);
    const userIsAdmin = auth.sessionClaims?.metadata?.role === "admin";
    if (!userIsAdmin) {
        throw new forbidden_error_1.default("Forbidden");
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=authorization-middleware.js.map
import express from "express";
import { getSalesData } from "../application/sales";
import isAuthenticated from "./middleware/authentication-middleware";

export const salesRouter = express.Router();

salesRouter.route("/dashboard").get(isAuthenticated, getSalesData);

import express from "express";
import { createOrder, getOrder, getUserOrders, getAllOrders } from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.route("/").post(isAuthenticated, createOrder);
orderRouter.route("/user").get(isAuthenticated, getUserOrders);
orderRouter.route("/admin").get(isAuthenticated, getAllOrders);
orderRouter.route("/:id").get(isAuthenticated, getOrder);

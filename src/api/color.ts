import express from "express";
import { getAllColors, createColor } from "../application/color";
import isAuthenticated from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const colorRouter = express.Router();

colorRouter.get("/", getAllColors);
colorRouter.post("/", isAuthenticated, isAdmin, createColor);

export default colorRouter;

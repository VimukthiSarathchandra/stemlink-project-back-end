import { NextFunction, Request, Response } from "express";
declare const createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getUserOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getAllOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { createOrder, getOrder, getUserOrders, getAllOrders };

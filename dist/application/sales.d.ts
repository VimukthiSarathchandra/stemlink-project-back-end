import { NextFunction, Request, Response } from "express";
declare const getSalesData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getSalesData };

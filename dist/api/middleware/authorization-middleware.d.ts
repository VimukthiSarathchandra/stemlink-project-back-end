import { Request, Response, NextFunction } from "express";
declare const isAdmin: (req: Request, res: Response, next: NextFunction) => void;
export { isAdmin };

import { Request, Response, NextFunction } from "express";
declare const isAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
export default isAuthenticated;

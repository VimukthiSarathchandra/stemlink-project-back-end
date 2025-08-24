import { Request, Response, NextFunction } from "express";
declare const getAllColors: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const createColor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getAllColors, createColor, };

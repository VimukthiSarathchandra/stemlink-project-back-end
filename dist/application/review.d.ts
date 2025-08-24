import { Request, Response, NextFunction } from "express";
declare const createReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { createReview };

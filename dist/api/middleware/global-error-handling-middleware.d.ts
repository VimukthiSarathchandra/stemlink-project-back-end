import { Request, Response, NextFunction } from "express";
declare const globalErrorHandlingMiddleware: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export default globalErrorHandlingMiddleware;

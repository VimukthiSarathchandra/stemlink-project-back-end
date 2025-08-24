import { Request, Response } from "express";
export declare const manuallyUpdateOrderStatus: (req: Request, res: Response) => Promise<void>;
export declare const handleWebhook: (req: Request, res: Response) => Promise<void>;
export declare const createCheckoutSession: (req: Request, res: Response) => Promise<void>;
export declare const retrieveSessionStatus: (req: Request, res: Response) => Promise<void>;

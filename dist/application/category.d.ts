import { Request, Response, NextFunction } from "express";
declare const getAllCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const createCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const getCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const updateCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const deleteCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById, };

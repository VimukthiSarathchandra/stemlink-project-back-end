import Color from "../infrastructure/db/entities/Color";
import { Request, Response, NextFunction } from "express";

const getAllColors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const colors = await Color.find({ isActive: true }).sort({ name: 1 });
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

const createColor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, hexCode } = req.body;
    
    // Check if color already exists
    const existingColor = await Color.findOne({ 
      $or: [{ name }, { hexCode }] 
    });
    
    if (existingColor) {
      return res.status(400).json({ 
        error: "Color with this name or hex code already exists" 
      });
    }

    const color = await Color.create({ name, hexCode });
    res.status(201).json(color);
  } catch (error) {
    next(error);
  }
};

export {
  getAllColors,
  createColor,
};

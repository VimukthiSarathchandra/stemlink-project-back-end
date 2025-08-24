"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColor = exports.getAllColors = void 0;
const Color_1 = __importDefault(require("../infrastructure/db/entities/Color"));
const getAllColors = async (req, res, next) => {
    try {
        const colors = await Color_1.default.find({ isActive: true }).sort({ name: 1 });
        res.json(colors);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllColors = getAllColors;
const createColor = async (req, res, next) => {
    try {
        const { name, hexCode } = req.body;
        // Check if color already exists
        const existingColor = await Color_1.default.findOne({
            $or: [{ name }, { hexCode }]
        });
        if (existingColor) {
            res.status(400).json({
                error: "Color with this name or hex code already exists"
            });
            return;
        }
        const color = await Color_1.default.create({ name, hexCode });
        res.status(201).json(color);
    }
    catch (error) {
        next(error);
    }
};
exports.createColor = createColor;
//# sourceMappingURL=color.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryById = exports.updateCategoryById = exports.getCategoryById = exports.createCategory = exports.getAllCategories = void 0;
const Category_1 = __importDefault(require("../infrastructure/db/entities/Category"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category_1.default.find();
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCategories = getAllCategories;
const createCategory = async (req, res, next) => {
    try {
        const newCategory = req.body;
        if (!newCategory.name) {
            throw new validation_error_1.default("Category name is required");
        }
        await Category_1.default.create(newCategory);
        res.status(201).json(newCategory);
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            throw new not_found_error_1.default("Category not found");
        }
        res.json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoryById = getCategoryById;
const updateCategoryById = async (req, res, next) => {
    try {
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!category) {
            throw new not_found_error_1.default("Category not found");
        }
        res.status(200).json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategoryById = updateCategoryById;
const deleteCategoryById = async (req, res, next) => {
    try {
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            throw new not_found_error_1.default("Category not found");
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategoryById = deleteCategoryById;
//# sourceMappingURL=category.js.map
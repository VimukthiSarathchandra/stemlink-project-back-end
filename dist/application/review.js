"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = void 0;
const Review_1 = __importDefault(require("../infrastructure/db/entities/Review"));
const Product_1 = __importDefault(require("../infrastructure/db/entities/Product"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const createReview = async (req, res, next) => {
    try {
        const data = req.body;
        const review = await Review_1.default.create({
            review: data.review,
            rating: data.rating,
        });
        const product = await Product_1.default.findById(data.productId);
        if (!product) {
            throw new not_found_error_1.default("Product not found");
        }
        product.reviews.push(review._id);
        await product.save();
        res.status(201).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
//# sourceMappingURL=review.js.map
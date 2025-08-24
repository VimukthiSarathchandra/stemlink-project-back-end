"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const product_1 = require("../application/product");
exports.productRouter = express_1.default.Router();
exports.productRouter.route("/").get(product_1.getAllProducts);
exports.productRouter.route("/search").get(product_1.getProductsForSearchQuery);
exports.productRouter.route("/").post(product_1.createProduct);
exports.productRouter.route("/images").post(product_1.putImage);
exports.productRouter.route("/images/:imageId").get(product_1.serveImageWithCORS);
exports.productRouter.route("/:productId").get(product_1.getProductById);
exports.productRouter.route("/:productId").put(product_1.updateProduct);
//# sourceMappingURL=product.js.map
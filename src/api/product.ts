import express from "express";
import {
  getAllProducts,
  getProductsForSearchQuery,
  createProduct,
  putImage,
  serveImageWithCORS,
  getProductById,
  updateProduct
} from "../application/product";

export const productRouter = express.Router();

productRouter.route("/").get(getAllProducts);
productRouter.route("/search").get(getProductsForSearchQuery);
productRouter.route("/").post(createProduct);
productRouter.route("/images").post(putImage);
productRouter.route("/images/:imageId").get(serveImageWithCORS);
productRouter.route("/:productId").get(getProductById);
productRouter.route("/:productId").put(updateProduct);

import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products/", getAllProducts);

router.get("/products/:id", getProductById);

router.post("/products/", createProduct);

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);
router.get("/products/category/:category", getProductsByCategory);


export default router;

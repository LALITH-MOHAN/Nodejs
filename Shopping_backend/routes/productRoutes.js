import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllCategories // Add this import
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add this new route at the top
router.get("/categories", getAllCategories);

// Keep all existing routes exactly the same
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);
router.get("/category/:category", getProductsByCategory);

export default router;
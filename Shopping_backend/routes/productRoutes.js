import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllCategories 
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/categories", getAllCategories);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);
router.get("/category/:category", getProductsByCategory);

export default router;
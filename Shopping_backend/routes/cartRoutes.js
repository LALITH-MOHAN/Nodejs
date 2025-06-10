import express from "express";
import {
  getUserCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  emptyCart
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getUserCart);
router.post("/", authenticate, addItemToCart);
router.put("/:productId", authenticate, updateItemQuantity);
router.delete("/:productId", authenticate, removeItemFromCart);
router.delete("/", authenticate, emptyCart);

export default router;
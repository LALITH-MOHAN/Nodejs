import express from "express";
import { placeOrder, getOrders } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, placeOrder);
router.get("/", authenticate, getOrders);

export default router;
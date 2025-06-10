import { createOrder, getUserOrders } from "../models/orderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await createOrder(userId, total, items);
    res.status(201).json(order);
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: error.message });
  }
};
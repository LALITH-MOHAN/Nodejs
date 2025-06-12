import { createOrder, getUserOrders } from "../models/orderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await createOrder(userId, total, items);
    const { orders } = await getUserOrders(userId);
    
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const { orders, total, totalPages, currentPage } = await getUserOrders(userId, page);
    res.json({
      orders,
      pagination: {
        total,
        totalPages,
        currentPage
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
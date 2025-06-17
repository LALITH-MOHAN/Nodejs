import { placeUserOrder, fetchUserOrders } from "../services/orderService.js";
import { getModuleLogger } from "../utils/logger.js";

const logger = getModuleLogger('order');

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || !items.length) {
      logger.warn(`User ${userId} attempted to place an order with an empty cart`);
      return res.status(400).json({ message: "Cart is empty" });
    }

    logger.info(`User ${userId} placing order for ${items.length} items`);
    await placeUserOrder(userId, items, total);

    const { orders } = await fetchUserOrders(userId);
    logger.info(`Order placed successfully for user ${userId}`);
    
    res.status(201).json(orders);
  } catch (error) {
    logger.error(`Error placing order for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;

    logger.info(`Fetching order history for user ${userId} (page ${page})`);

    const { orders, total, totalPages, currentPage } = await fetchUserOrders(userId, page);
    res.json({
      orders,
      pagination: {
        total,
        totalPages,
        currentPage
      }
    });
  } catch (error) {
    logger.error(`Error fetching orders for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

import {
  fetchCart,
  addItem,
  updateItem,
  removeItem,
  clearUserCart
} from "../services/cartService.js";
import { getModuleLogger } from "../utils/logger.js";

const logger = getModuleLogger('cart');

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching cart for user ${userId}`);
    const cartItems = await fetchCart(userId);
    res.json(cartItems);
  } catch (error) {
    logger.error(`Error fetching cart: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    logger.info(`Adding product ${productId} (qty: ${quantity}) to user ${userId}'s cart`);
    const cartItems = await addItem(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    logger.error(`Error adding item to cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    logger.info(`Updating quantity of product ${productId} to ${quantity} for user ${userId}`);
    const cartItems = await updateItem(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    logger.error(`Error updating cart item: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    logger.info(`Removing product ${productId} from user ${userId}'s cart`);
    const cartItems = await removeItem(userId, productId);
    res.json(cartItems);
  } catch (error) {
    logger.error(`Error removing item from cart: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Emptying cart for user ${userId}`);
    await clearUserCart(userId);
    res.json([]);
  } catch (error) {
    logger.error(`Error emptying cart: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

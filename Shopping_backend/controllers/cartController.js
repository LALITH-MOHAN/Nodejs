import {
  fetchCart,
  addItem,
  updateItem,
  removeItem,
  clearUserCart
} from "../services/cartService.js";

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await fetchCart(userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const cartItems = await addItem(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const cartItems = await updateItem(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cartItems = await removeItem(userId, productId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await clearUserCart(userId);
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

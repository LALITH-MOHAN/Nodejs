import { getCartItems, addToCart, updateCartItem, removeFromCart, clearCart } from "../models/cartModel.js";
  
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const cartItems = await addToCart(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message }); // Changed to 400 for client errors
  }
};
  
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const cartItems = await updateCartItem(userId, productId, quantity);
    res.json(cartItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
  
export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cartItems = await removeFromCart(userId, productId);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
export const emptyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await clearCart(userId);
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
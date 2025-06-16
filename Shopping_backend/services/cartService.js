
import {
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  } from "../model/cartModel.js";
  
  export const fetchCart = async (userId) => {
    return await getCartItems(userId);
  };
  
  export const addItem = async (userId, productId, quantity) => {
    return await addToCart(userId, productId, quantity);
  };
  
  export const updateItem = async (userId, productId, quantity) => {
    return await updateCartItem(userId, productId, quantity);
  };
  
  export const removeItem = async (userId, productId) => {
    return await removeFromCart(userId, productId);
  };
  
  export const clearUserCart = async (userId) => {
    return await clearCart(userId);
  };
  
import db from "../config/db.js";

export const getCartItems = async (userId) => {
  const [rows] = await db.query(`SELECT ci.id, ci.quantity,p.id as product_id, p.title, p.price, p.thumbnail, p.stock 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `, [userId]);
  return rows;};

export const addToCart = async (userId, productId, quantity = 1) => {
  const [existing] = await db.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing.length > 0) {
    const newQuantity = existing[0].quantity + quantity;
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [newQuantity, userId, productId]
    );
  } else {
    await db.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
  }

  return getCartItems(userId);
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    await removeFromCart(userId, productId);
  } else {
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
  }
  return getCartItems(userId);
};

export const removeFromCart = async (userId, productId) => {
  await db.query(
    'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return getCartItems(userId);
};

export const clearCart = async (userId) => {
  await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  return [];
};
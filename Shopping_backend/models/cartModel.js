import db from "../config/db.js";

export const getCartItems = async (userId) => {
  const [rows] = await db.query(`
    SELECT ci.id, ci.quantity, 
           p.id as product_id, p.title, p.price, p.thumbnail, p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `, [userId]);
  return rows;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  // First check product stock
  const [product] = await db.query(
    'SELECT stock FROM products WHERE id = ?',
    [productId]
  );

  if (!product.length) {
    throw new Error('Product not found');
  }

  const availableStock = product[0].stock;

  // Check if item already exists in cart
  const [existing] = await db.query(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  const currentCartQuantity = existing.length ? existing[0].quantity : 0;
  const newQuantity = currentCartQuantity + quantity;

  // Check if user is trying to add more than available stock (including what's already in their cart)
  if (newQuantity > availableStock) {
    throw new Error(`You can't add more than ${availableStock} items of this product`);
  }

  if (existing.length > 0) {
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
    // Check stock before updating (considering what's already in their cart)
    const [product] = await db.query(
      'SELECT stock FROM products WHERE id = ?',
      [productId]
    );
    
    if (product.length && quantity > product[0].stock) {
      throw new Error(`You can't add more than ${product[0].stock} items of this product`);
    }

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
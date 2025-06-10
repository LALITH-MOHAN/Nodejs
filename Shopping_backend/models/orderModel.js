import db from "../config/db.js";

export const createOrder = async (userId, total, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Create the order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items 
        (order_id, product_id, title, price, quantity, thumbnail) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.title, item.price, item.quantity, item.thumbnail]
      );

      // Update product stock
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    await conn.commit();
    return orderId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const getUserOrders = async (userId) => {
  try {
    // Get orders with items in a single query
    const [orders] = await db.query(
      `SELECT 
        o.id, 
        o.user_id as userId,
        o.total, 
        o.status, 
        o.created_at as date,
        oi.product_id as productId,
        oi.title,
        oi.price,
        oi.quantity,
        oi.thumbnail
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // Group items by order
    const ordersMap = new Map();
    orders.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          userId: row.userId,
          total: parseFloat(row.total),
          status: row.status,
          date: row.date.toISOString(),
          items: []
        });
      }
      ordersMap.get(row.id).items.push({
        id: row.productId,
        title: row.title,
        price: parseFloat(row.price),
        quantity: row.quantity,
        thumbnail: row.thumbnail
      });
    });

    return Array.from(ordersMap.values());
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};
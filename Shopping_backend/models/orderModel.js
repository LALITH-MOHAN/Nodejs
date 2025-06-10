import db from "../config/db.js";

export const createOrder = async (userId, total, items) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Create the order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const orderId = orderResult.insertId;

    // 2. Add order items and update product stock
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, title, price, quantity, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, item.price, item.quantity, item.thumbnail]
      );

      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    await conn.commit();
    
    // 3. Return the complete order
    const [order] = await conn.query(`
      SELECT o.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.product_id,
            'title', oi.title,
            'price', oi.price,
            'quantity', oi.quantity,
            'thumbnail', oi.thumbnail
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `, [orderId]);

    return order[0];
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const getUserOrders = async (userId) => {
  const [orders] = await db.query(`
    SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', oi.product_id,
          'title', oi.title,
          'price', oi.price,
          'quantity', oi.quantity,
          'thumbnail', oi.thumbnail
        )
      ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [userId]);

  return orders;
};
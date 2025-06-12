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
      const [product] = await conn.query(
        'SELECT stock FROM products WHERE id = ? FOR UPDATE',
        [item.id]
      );

      if (!product.length) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (product[0].stock < item.quantity) {
        throw new Error(`Not enough stock for product ${item.id}`);
      }

      await conn.query(
        `INSERT INTO order_items 
        (order_id, product_id, title, price, quantity, thumbnail) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.title, item.price, item.quantity, item.thumbnail]
      );

      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    await conn.commit();
    
    const [newOrder] = await conn.query(
      `SELECT o.id, o.total, o.status, o.created_at as date
       FROM orders o
       WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await conn.query(
      `SELECT 
        product_id as id,
        title,
        price,
        quantity,
        thumbnail
       FROM order_items
       WHERE order_id = ?`,
      [orderId]
    );

    return {
      ...newOrder[0],
      items: orderItems
    };

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const getUserOrders = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
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
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Get total count for pagination
    const [count] = await db.query(
      `SELECT COUNT(DISTINCT o.id) as total
       FROM orders o
       WHERE o.user_id = ?`,
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

    return {
      orders: Array.from(ordersMap.values()),
      total: count[0].total,
      totalPages: Math.ceil(count[0].total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};
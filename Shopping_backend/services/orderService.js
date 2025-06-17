import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import Product from '../models/productModel.js';
import sequelize from '../config/db.js';
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('order');

// Model functions
const createOrder = async (userId, total, items) => {
  return await sequelize.transaction(async (t) => {
    logger.info(`Creating order for user ${userId} with total ${total}`);

    const order = await Order.create(
      { userId, total },
      { transaction: t }
    );

    for (const item of items) {
      logger.debug(`Checking stock for product ${item.id} (qty: ${item.quantity})`);

      const product = await Product.findByPk(item.id, {
        attributes: ['stock'],
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!product) {
        logger.error(`Product ${item.id} not found`);
        throw new Error(`Product ${item.id} not found`);
      }

      if (product.stock < item.quantity) {
        logger.error(`Not enough stock for product ${item.id}`);
        throw new Error(`Not enough stock for product ${item.id}`);
      }

      await OrderItem.create({
        orderId: order.id,
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail
      }, { transaction: t });

      await Product.update(
        { stock: sequelize.literal(`stock - ${item.quantity}`) },
        { where: { id: item.id }, transaction: t }
      );

      logger.debug(`Stock reduced for product ${item.id} by ${item.quantity}`);
    }

    const orderWithItems = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        attributes: ['productId', 'title', 'price', 'quantity', 'thumbnail'],
        required: false
      }],
      transaction: t
    });

    logger.info(`Order ${order.id} created successfully`);

    return {
      id: orderWithItems.id,
      total: parseFloat(orderWithItems.total),
      status: orderWithItems.status,
      date: orderWithItems.created_at.toISOString(),
      items: orderWithItems.OrderItems.map(item => ({
        id: item.productId,
        title: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
        thumbnail: item.thumbnail
      }))
    };
  });
};

const getUserOrders = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  logger.info(`Fetching orders for user ${userId} - Page ${page}`);

  const { count, rows } = await Order.findAndCountAll({
    where: { userId },
    include: [{
      model: OrderItem,
      attributes: ['productId', 'title', 'price', 'quantity', 'thumbnail'],
      required: true
    }],
    order: [['created_at', 'DESC']],
    limit,
    offset,
    distinct: true 
  });

  const orders = rows.map(order => ({
    id: order.id,
    userId: order.userId,
    total: parseFloat(order.total),
    status: order.status,
    date: order.created_at.toISOString(),
    items: order.OrderItems.map(item => ({
      id: item.productId,
      title: item.title,
      price: parseFloat(item.price),
      quantity: item.quantity,
      thumbnail: item.thumbnail
    }))
  }));

  logger.debug(`Total orders fetched: ${count}`);

  return {
    orders,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

// Service functions
export const placeUserOrder = async (userId, items, total) => {
  try {
    logger.info(`User ${userId} is placing an order for ${items.length} items. Total: ${total}`);
    const order = await createOrder(userId, total, items);
    return order;
  } catch (error) {
    logger.error(`Failed to place order for user ${userId}: ${error.message}`);
    throw error;
  }
};

export const fetchUserOrders = async (userId, page = 1, limit = 10) => {
  return await getUserOrders(userId, page, limit);
};

import { Order, OrderItem, Product, sequelize } from '../models/index.js';

export const createOrder = async (userId, total, items) => {
  return await sequelize.transaction(async (t) => {
    const order = await Order.create(
      { userId, total },
      { transaction: t }
    );

    for (const item of items) {
      const product = await Product.findByPk(item.id, {
        attributes: ['stock'],
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (product.stock < item.quantity) {
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
    }

    const orderWithItems = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        attributes: ['productId', 'title', 'price', 'quantity', 'thumbnail'],
        required: false
      }],
      transaction: t
    });

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

export const getUserOrders = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
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

  return {
    orders,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};
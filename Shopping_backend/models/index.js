import sequelize from '../config/db.js';
import User from './userModel.js';
import Product from './productModel.js';
import CartItem from './cartItemModel.js';
import Order from './orderModel.js';
import OrderItem from './orderItemModel.js';

// Define associations
User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export {
  sequelize,
  User,
  Product,
  CartItem,
  Order,
  OrderItem
};
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './Order.js';
import Product from './Product.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING(512),
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

// Associations
OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    constraints: false
  });
  Order.hasMany(OrderItem, { foreignKey: 'order_id' });


OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    constraints: false
  });Product.hasMany(OrderItem, { foreignKey: 'product_id' });

export default OrderItem;

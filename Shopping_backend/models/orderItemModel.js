import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id'
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
    type: DataTypes.STRING(512)
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

OrderItem.associate = function() {
  const { Order, Product } = sequelize.models;
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });
};

export default OrderItem;
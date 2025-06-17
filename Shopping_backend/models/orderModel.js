import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Order.associate = function() {
  const { User, OrderItem } = sequelize.models;
  Order.belongsTo(User, { foreignKey: 'userId' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId' });
};

export default Order;
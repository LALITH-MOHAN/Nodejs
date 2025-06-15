import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});

// ✅ Association - with nullable foreign key
Order.belongsTo(User, {
    foreignKey: 'user_id',
    constraints: false // Since we manually created the constraint
  });

User.hasMany(Order, {
  foreignKey: {
    name: 'user_id',
    allowNull: true
  }
});

export default Order;

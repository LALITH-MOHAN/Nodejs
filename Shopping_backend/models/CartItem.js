import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Product from './Product.js';

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cart_items',
  timestamps: false
});

// Associations
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, {
    foreignKey: 'user_id',
    constraints: false
  });
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });

CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    constraints: false
  });
export default CartItem;

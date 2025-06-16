import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CartItem = sequelize.define('CartItem', {
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
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id' 
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'], 
      name: 'cart_items_user_id_product_id'
    }
  ]
});

export default CartItem;
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  thumbnail: {
    type: DataTypes.STRING(512)
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Product.associate = function() {
  const { CartItem, OrderItem } = sequelize.models;
  Product.hasMany(CartItem, { foreignKey: 'productId' });
  Product.hasMany(OrderItem, { foreignKey: 'productId' });
};

export default Product;
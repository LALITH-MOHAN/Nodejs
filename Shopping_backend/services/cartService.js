import CartItem from '../models/cartItemModel.js';
import Product from '../models/productModel.js';
import sequelize from '../config/db.js';

// Model functions
const getCartItems = async (userId) => {
  return await CartItem.findAll({
    where: { userId },
    include: [{
      model: Product,
      attributes: ['id', 'title', 'price', 'thumbnail', 'stock'],
      required: true
    }],
    raw: true
  }).then(items => items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    product_id: item['Product.id'],
    title: item['Product.title'],
    price: item['Product.price'],
    thumbnail: item['Product.thumbnail'],
    stock: item['Product.stock']
  })));
};

const addToCart = async (userId, productId, quantity = 1) => {
  return await sequelize.transaction(async (t) => {
    const product = await Product.findByPk(productId, {
      attributes: ['stock'],
      transaction: t
    });
    
    if (!product) throw new Error('Product not found');

    const existing = await CartItem.findOne({
      where: { userId, productId },
      transaction: t
    });

    const currentCartQuantity = existing ? existing.quantity : 0;
    const newQuantity = currentCartQuantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error(`You can't add more than ${product.stock} items of this product`);
    }

    if (existing) {
      await existing.update({ quantity: newQuantity }, { transaction: t });
    } else {
      await CartItem.create({ userId, productId, quantity }, { transaction: t });
    }

    return getCartItems(userId);
  });
};

const updateCartItem = async (userId, productId, quantity) => {
  return await sequelize.transaction(async (t) => {
    if (quantity < 1) {
      await removeFromCart(userId, productId, t);
    } else {
      const product = await Product.findByPk(productId, {
        attributes: ['stock'],
        transaction: t
      });
      
      if (product && quantity > product.stock) {
        throw new Error(`You can't add more than ${product.stock} items of this product`);
      }

      await CartItem.update(
        { quantity },
        { where: { userId, productId }, transaction: t }
      );
    }
    return getCartItems(userId);
  });
};

const removeFromCart = async (userId, productId, transaction) => {
  await CartItem.destroy({
    where: { userId, productId },
    transaction
  });
  return getCartItems(userId);
};

const clearCart = async (userId) => {
  await CartItem.destroy({ where: { userId } });
  return [];
};

// Service functions
export const fetchCart = async (userId) => {
  return await getCartItems(userId);
};

export const addItem = async (userId, productId, quantity) => {
  return await addToCart(userId, productId, quantity);
};

export const updateItem = async (userId, productId, quantity) => {
  return await updateCartItem(userId, productId, quantity);
};

export const removeItem = async (userId, productId) => {
  return await removeFromCart(userId, productId);
};

export const clearUserCart = async (userId) => {
  return await clearCart(userId);
};
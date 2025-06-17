import CartItem from '../models/cartItemModel.js';
import Product from '../models/productModel.js';
import sequelize from '../config/db.js';

export const getCartItems = async (userId) => {
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
export const addToCart = async (userId, productId, quantity = 1) => {
  return await sequelize.transaction(async (t) => {
    // Check product stock
    const product = await Product.findByPk(productId, {
      attributes: ['stock'],
      transaction: t
    });
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if item already exists in cart
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

export const updateCartItem = async (userId, productId, quantity) => {
  return await sequelize.transaction(async (t) => {
    if (quantity < 1) {
      await removeFromCart(userId, productId, t);
    } else {
      // Check stock before updating
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

export const removeFromCart = async (userId, productId, transaction) => {
  await CartItem.destroy({
    where: { userId, productId },
    transaction
  });
  return getCartItems(userId);
};

export const clearCart = async (userId) => {
  await CartItem.destroy({ where: { userId } });
  return [];
};
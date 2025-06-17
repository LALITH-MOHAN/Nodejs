import CartItem from '../models/cartItemModel.js';
import Product from '../models/productModel.js';
import sequelize from '../config/db.js';
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('cart');

// Model functions
const getCartItems = async (userId) => {
  try {
    logger.debug(`Fetching cart items for user ${userId}`);
    const items = await CartItem.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'title', 'price', 'thumbnail', 'stock'],
        required: true
      }],
      raw: true
    });

    logger.info(`Fetched ${items.length} cart items for user ${userId}`);

    return items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product_id: item['Product.id'],
      title: item['Product.title'],
      price: item['Product.price'],
      thumbnail: item['Product.thumbnail'],
      stock: item['Product.stock']
    }));
  } catch (error) {
    logger.error(`Error fetching cart items: ${error.message}`);
    throw error;
  }
};

const addToCart = async (userId, productId, quantity = 1) => {
  try {
    logger.debug(`Adding product ${productId} (qty: ${quantity}) to user ${userId}'s cart`);

    return await sequelize.transaction(async (t) => {
      const product = await Product.findByPk(productId, {
        attributes: ['stock'],
        transaction: t
      });

      if (!product) {
        logger.error(`Product ${productId} not found`);
        throw new Error('Product not found');
      }

      const existing = await CartItem.findOne({
        where: { userId, productId },
        transaction: t
      });

      const currentCartQuantity = existing ? existing.quantity : 0;
      const newQuantity = currentCartQuantity + quantity;

      if (newQuantity > product.stock) {
        logger.warn(`Requested quantity ${newQuantity} exceeds stock ${product.stock}`);
        throw new Error(`You can't add more than ${product.stock} items of this product`);
      }

      if (existing) {
        await existing.update({ quantity: newQuantity }, { transaction: t });
        logger.info(`Updated quantity of product ${productId} to ${newQuantity}`);
      } else {
        await CartItem.create({ userId, productId, quantity }, { transaction: t });
        logger.info(`Added product ${productId} to cart for user ${userId}`);
      }

      return getCartItems(userId);
    });
  } catch (error) {
    logger.error(`Error adding to cart: ${error.message}`);
    throw error;
  }
};

const updateCartItem = async (userId, productId, quantity) => {
  try {
    logger.debug(`Updating product ${productId} to quantity ${quantity} in user ${userId}'s cart`);

    return await sequelize.transaction(async (t) => {
      if (quantity < 1) {
        logger.info(`Quantity is 0 or less. Removing product ${productId} from user ${userId}'s cart`);
        await removeFromCart(userId, productId, t);
      } else {
        const product = await Product.findByPk(productId, {
          attributes: ['stock'],
          transaction: t
        });

        if (product && quantity > product.stock) {
          logger.warn(`Quantity ${quantity} exceeds stock ${product.stock} for product ${productId}`);
          throw new Error(`You can't add more than ${product.stock} items of this product`);
        }

        await CartItem.update(
          { quantity },
          { where: { userId, productId }, transaction: t }
        );
        logger.info(`Updated cart item ${productId} to quantity ${quantity}`);
      }
      return getCartItems(userId);
    });
  } catch (error) {
    logger.error(`Error updating cart item: ${error.message}`);
    throw error;
  }
};

const removeFromCart = async (userId, productId, transaction) => {
  try {
    logger.debug(`Removing product ${productId} from user ${userId}'s cart`);
    await CartItem.destroy({
      where: { userId, productId },
      transaction
    });
    logger.info(`Removed product ${productId} from user ${userId}'s cart`);
    return getCartItems(userId);
  } catch (error) {
    logger.error(`Error removing cart item: ${error.message}`);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    logger.debug(`Clearing entire cart for user ${userId}`);
    await CartItem.destroy({ where: { userId } });
    logger.info(`Cleared all items from cart for user ${userId}`);
    return [];
  } catch (error) {
    logger.error(`Error clearing cart: ${error.message}`);
    throw error;
  }
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

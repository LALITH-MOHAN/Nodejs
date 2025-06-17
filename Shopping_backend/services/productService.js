import Product from '../models/productModel.js';
import sequelize from '../config/db.js';
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('product');

const fetchAllCategories = async () => {
  try {
    logger.debug('Fetching all product categories from DB');
    const categories = await Product.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: sequelize.where(sequelize.col('category'), 'IS NOT', null),
      raw: true,
    });
    return categories.map(row => row.category);
  } catch (error) {
    logger.error('Error in fetchAllCategories:', error);
    throw error;
  }
};

const fetchAllProducts = async (page = 1, limit = 9) => {
  const offset = (page - 1) * limit;
  logger.debug(`Fetching products for page ${page} with offset ${offset}`);
  const { count, rows } = await Product.findAndCountAll({
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    limit,
    offset,
    raw: true,
  });
  return {
    products: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const fetchProductById = async (id) => {
  logger.debug(`Fetching product by ID: ${id}`);
  return await Product.findByPk(id, {
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    raw: true,
  });
};

const insertProduct = async (productData) => {
  const product = await Product.create(productData);
  logger.info(`Inserted new product with ID: ${product.id}`);
  return product.id;
};

const updateProductById = async (id, data) => {
  logger.info(`Updating product ID: ${id}`);
  await Product.update(data, { where: { id } });
};

const deleteProductById = async (id) => {
  logger.info(`Deleting product ID: ${id}`);
  await Product.destroy({ where: { id } });
};

const fetchProductsByCategory = async (category, page = 1, limit = 9) => {
  const offset = (page - 1) * limit;
  logger.debug(`Fetching products by category: ${category}, page: ${page}`);
  const { count, rows } = await Product.findAndCountAll({
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    where: { category },
    limit,
    offset,
    raw: true,
  });
  return {
    products: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

export const getCategories = async () => {
  try {
    const categories = await fetchAllCategories();
    logger.info(`Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    logger.error('Error in service getCategories:', error);
    throw error;
  }
};

export const getProducts = async (page = 1) => await fetchAllProducts(page);
export const getProduct = async (id) => await fetchProductById(id);
export const createNewProduct = async (productData) => {
  const id = await insertProduct(productData);
  return await fetchProductById(id);
};
export const updateExistingProduct = async (id, data) => {
  await updateProductById(id, data);
  return await fetchProductById(id);
};
export const deleteExistingProduct = async (id) => {
  await deleteProductById(id);
};
export const getProductsByCategoryService = async (category, page = 1) =>
  await fetchProductsByCategory(category, page);

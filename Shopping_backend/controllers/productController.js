import {
  getCategories,
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProductsByCategoryService
} from "../services/productService.js";
import { getModuleLogger } from '../utils/logger.js';

const logger = getModuleLogger('product');

export const getAllCategories = async (req, res) => {
  try {
    logger.info('GET /categories request received');
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    logger.error('Failed to get categories', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    logger.info(`GET /products?page=${page} called`);
    const data = await getProducts(page);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`GET /products/${id} request`);
    const product = await getProduct(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    logger.error(`Error fetching product ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    logger.info('POST /products request received');
    const product = await createNewProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    logger.error('Error creating product', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`PUT /products/${id} request`);
    const product = await updateExistingProduct(id, req.body);
    res.json(product);
  } catch (error) {
    logger.error(`Error updating product ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    logger.info(`DELETE /products/${id} request`);
    await deleteExistingProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting product ${req.params.id}`, error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    logger.info(`GET /products/category/${category}?page=${page}`);
    const data = await getProductsByCategoryService(category, page);
    res.json(data);
  } catch (error) {
    logger.error('Error getting products by category', error);
    res.status(500).json({ error: error.message });
  }
};

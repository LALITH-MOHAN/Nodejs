import Product from '../models/productModel.js';
import sequelize from '../config/db.js';

// Model functions
const fetchAllCategories = async () => {
  try {
    console.log('Executing Sequelize query for categories');
    const categories = await Product.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      where: sequelize.where(sequelize.col('category'), 'IS NOT', null),
      raw: true
    });
    
    return categories.map(row => row.category);
  } catch (error) {
    console.error('Model error:', error);
    throw error;
  }
};

const fetchAllProducts = async (page = 1, limit = 9) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Product.findAndCountAll({
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    limit,
    offset,
    raw: true
  });
  
  return {
    products: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

const fetchProductById = async (id) => {
  return await Product.findByPk(id, {
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    raw: true
  });
};

const insertProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.id;
};

const updateProductById = async (id, data) => {
  await Product.update(data, { where: { id } });
};

const deleteProductById = async (id) => {
  await Product.destroy({ where: { id } });
};

const fetchProductsByCategory = async (category, page = 1, limit = 9) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Product.findAndCountAll({
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    where: { category },
    limit,
    offset,
    raw: true
  });
  
  return {
    products: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

// Service functions
export const getCategories = async () => {
  try {
    const categories = await fetchAllCategories();
    console.log('Categories fetched:', categories);
    
    if (!categories || categories.length === 0) {
      console.warn('No categories found in database');
      return []; 
    }
    return categories;
  } catch (error) {
    console.error('Service layer error:', error);
    throw error;
  }
};

export const getProducts = async (page = 1) => {
  return await fetchAllProducts(page);
};

export const getProduct = async (id) => {
  return await fetchProductById(id);
};

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

export const getProductsByCategoryService = async (category, page = 1) => {
  return await fetchProductsByCategory(category, page);
};
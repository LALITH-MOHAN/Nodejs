import { Product, sequelize } from '../models/index.js';
export const fetchAllCategories = async () => {
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
export const fetchAllProducts = async (page = 1, limit = 9) => {
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

export const fetchProductById = async (id) => {
  return await Product.findByPk(id, {
    attributes: ['id', 'title', 'price', 'thumbnail', 'stock', 'description', 'category'],
    raw: true
  });
};

export const insertProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.id;
};

export const updateProductById = async (id, data) => {
  await Product.update(data, { where: { id } });
};

export const deleteProductById = async (id) => {
  await Product.destroy({ where: { id } });
};

export const fetchProductsByCategory = async (category, page = 1, limit = 9) => {
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
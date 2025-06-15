import {
  fetchAllProducts,
  fetchProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
  fetchProductsByCategory,
  fetchAllCategories
} from "../model/productModel.js";

export const getCategories = async () => {
  return await fetchAllCategories();
};

export const getProducts = async (page = 1) => {  // Added default parameter
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

export const getProductsByCategoryService = async (category, page = 1) => {  // Added default parameter
  return await fetchProductsByCategory(category, page);
};
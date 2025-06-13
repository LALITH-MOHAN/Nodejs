import {fetchAllProducts,fetchProductById,insertProduct,updateProductById,deleteProductById,fetchProductsByCategory,fetchAllCategories
  } from "../models/productModel.js";
  
  export const getCategories = async () => {
    return await fetchAllCategories();
  };
  
  export const getProducts = async (page) => {
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
  
  export const getProductsByCategoryService = async (category, page) => {
    return await fetchProductsByCategory(category, page);
  };
  
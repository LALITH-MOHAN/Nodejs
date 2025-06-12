import {
  fetchAllProducts,
  fetchProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
  fetchProductsByCategory,
  fetchAllCategories
} from "../models/productModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await fetchAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await fetchAllProducts(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await fetchProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const id = await insertProduct(productData);
    const product = await fetchProductById(id);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await updateProductById(id, req.body);
    const product = await fetchProductById(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteProductById(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const data = await fetchProductsByCategory(category, page); 
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
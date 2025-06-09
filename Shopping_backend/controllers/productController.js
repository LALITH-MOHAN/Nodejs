import {
  fetchAllProducts,
  fetchProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
  fetchProductsByCategory
} from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await fetchAllProducts();
    res.json(products);
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
    const id = await insertProduct(req.body);
    res.status(201).json({ message: "Product created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await updateProductById(id, req.body);
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteProductById(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await fetchProductsByCategory(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
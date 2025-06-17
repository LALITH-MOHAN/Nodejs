import {
  getCategories,
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProductsByCategoryService
} from "../services/productService.js";

export const getAllCategories = async (req, res) => {
  try {
    console.log('Received request for categories');
    const categories = await getCategories();
    
    if (!categories || categories.length === 0) {
      console.log('Returning empty categories array');
      return res.json([]); 
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await getProducts(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProduct(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await updateExistingProduct(id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteExistingProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const data = await getProductsByCategoryService(category, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

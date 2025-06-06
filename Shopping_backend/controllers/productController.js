import {
        fetchAllProducts,
        fetchProductById,
        insertProduct,
        updateProductById,
        deleteProductById
      } from "../models/productModel.js";
      
      // GET /products
      export const getAllProducts = async (req, res) => {
        const products = await fetchAllProducts();
        res.json(products);
      };
      
      // GET /products/:id
      export const getProductById = async (req, res) => {
        const id = req.params.id;
        const product = await fetchProductById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
      };
      
      // POST /products
      export const createProduct = async (req, res) => {
        const id = await insertProduct(req.body);
        res.status(201).json({ message: "Product created", id });
      };
      
      // PUT /products/:id
      export const updateProduct = async (req, res) => {
        const id = req.params.id;
        await updateProductById(id, req.body);
        res.json({ message: "Product updated" });
      };
      
      // DELETE /products/:id
      export const deleteProduct = async (req, res) => {
        const id = req.params.id;
        await deleteProductById(id);
        res.json({ message: "Product deleted" });
      };
      import { fetchProductsByCategory } from "../models/productModel.js";

export const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  const products = await fetchProductsByCategory(category);
  res.json(products);
};

import { describe, it, expect, vi, beforeEach } from 'vitest';
import db from '../../config/db.js';
import * as productModel from '../../models/productModel.js';

vi.mock('../../config/db.js');

describe('Product Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllCategories', () => {
    it('should return distinct categories', async () => {
      const mockCategories = [{ category: 'electronics' }, { category: 'clothing' }];
      db.query.mockResolvedValueOnce([mockCategories]);
      
      const result = await productModel.fetchAllCategories();
      expect(result).toEqual(['electronics', 'clothing']);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT DISTINCT category FROM products WHERE category IS NOT NULL'
      );
    });
  });

  describe('fetchAllProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1' }];
      const mockCount = [{ total: 10 }];
      
      db.query
        .mockResolvedValueOnce([mockProducts]) // First query returns products
        .mockResolvedValueOnce([mockCount]); // Second query returns count
      
      const result = await productModel.fetchAllProducts(1);
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(10);
      expect(result.totalPages).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, title, price, thumbnail, stock, description, category FROM products LIMIT ? OFFSET ?',
        [9, 0]
      );
      expect(db.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM products'
      );
    });
  });

  describe('fetchProductById', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, title: 'Product 1' };
      db.query.mockResolvedValueOnce([[mockProduct]]);
      
      const result = await productModel.fetchProductById(1);
      expect(result).toEqual(mockProduct);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, title, price, thumbnail, stock, description, category FROM products WHERE id = ?',
        [1]
      );
    });

    it('should return undefined for non-existent product', async () => {
      db.query.mockResolvedValueOnce([[]]);
      
      const result = await productModel.fetchProductById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('insertProduct', () => {
    it('should insert a new product and return insertId', async () => {
      const productData = { title: 'New Product', price: 100 };
      const mockResult = { insertId: 1 };
      db.query.mockResolvedValueOnce([mockResult]);
      
      const result = await productModel.insertProduct(productData);
      expect(result).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO products (title, price, thumbnail, stock, description, category) VALUES (?, ?, ?, ?, ?, ?)',
        [productData.title, productData.price, productData.thumbnail, productData.stock, productData.description, productData.category]
      );
    });
  });

  describe('updateProductById', () => {
    it('should update a product', async () => {
      const id = 1;
      const updateData = { title: 'Updated Product', price: 200 };
      db.query.mockResolvedValueOnce([{}]);
      
      await productModel.updateProductById(id, updateData);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE products SET title=?, price=?, thumbnail=?, stock=?, description=?, category=? WHERE id=?',
        [updateData.title, updateData.price, updateData.thumbnail, updateData.stock, updateData.description, updateData.category, id]
      );
    });
  });

  describe('deleteProductById', () => {
    it('should delete a product', async () => {
      const id = 1;
      db.query.mockResolvedValueOnce([{}]);
      
      await productModel.deleteProductById(id);
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM products WHERE id = ?',
        [id]
      );
    });
  });

  describe('fetchProductsByCategory', () => {
    it('should return paginated products by category', async () => {
      const category = 'electronics';
      const mockProducts = [{ id: 1, title: 'Product 1', category }];
      const mockCount = [{ total: 5 }];
      
      db.query
        .mockResolvedValueOnce([mockProducts]) // First query returns products
        .mockResolvedValueOnce([mockCount]); // Second query returns count
      
      const result = await productModel.fetchProductsByCategory(category, 1);
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(5);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, title, price, thumbnail, stock, description, category FROM products WHERE category = ? LIMIT ? OFFSET ?',
        [category, 9, 0]
      );
      expect(db.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM products WHERE category = ?',
        [category]
      );
    });
  });
});
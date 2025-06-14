import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCategories,
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProductsByCategoryService
} from '../../services/productService.js';
import * as productModel from '../../models/productModel.js';

// Mock the model layer
vi.mock('../../models/productModel.js');

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = ['electronics', 'clothing'];
      productModel.fetchAllCategories.mockResolvedValue(mockCategories);
      
      const result = await getCategories();
      expect(result).toEqual(mockCategories);
      expect(productModel.fetchAllCategories).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      productModel.fetchAllCategories.mockRejectedValue(new Error('Database error'));
      
      await expect(getCategories()).rejects.toThrow('Database error');
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1' }];
      const mockTotal = 10;
      productModel.fetchAllProducts.mockResolvedValue({
        products: mockProducts,
        total: mockTotal,
        totalPages: 2,
        currentPage: 1
      });
      
      const result = await getProducts(1);
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(mockTotal);
      expect(productModel.fetchAllProducts).toHaveBeenCalledWith(1);
    });

    it('should use default page if not provided', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1' }];
      productModel.fetchAllProducts.mockResolvedValue({
        products: mockProducts,
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
      
      await getProducts();
      expect(productModel.fetchAllProducts).toHaveBeenCalledWith(1);
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, title: 'Product 1' };
      productModel.fetchProductById.mockResolvedValue(mockProduct);
      
      const result = await getProduct(1);
      expect(result).toEqual(mockProduct);
      expect(productModel.fetchProductById).toHaveBeenCalledWith(1);
    });

    it('should return null for non-existent product', async () => {
      productModel.fetchProductById.mockResolvedValue(null);
      
      const result = await getProduct(999);
      expect(result).toBeNull();
    });
  });

  describe('createNewProduct', () => {
    it('should create and return a new product', async () => {
      const productData = { title: 'New Product', price: 100 };
      const mockId = 1;
      const mockProduct = { ...productData, id: mockId };
      
      productModel.insertProduct.mockResolvedValue(mockId);
      productModel.fetchProductById.mockResolvedValue(mockProduct);
      
      const result = await createNewProduct(productData);
      expect(result).toEqual(mockProduct);
      expect(productModel.insertProduct).toHaveBeenCalledWith(productData);
      expect(productModel.fetchProductById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('updateExistingProduct', () => {
    it('should update and return the updated product', async () => {
      const id = 1;
      const updateData = { title: 'Updated Product' };
      const mockProduct = { id, ...updateData };
      
      productModel.updateProductById.mockResolvedValue();
      productModel.fetchProductById.mockResolvedValue(mockProduct);
      
      const result = await updateExistingProduct(id, updateData);
      expect(result).toEqual(mockProduct);
      expect(productModel.updateProductById).toHaveBeenCalledWith(id, updateData);
      expect(productModel.fetchProductById).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteExistingProduct', () => {
    it('should delete a product', async () => {
      const id = 1;
      productModel.deleteProductById.mockResolvedValue();
      
      await deleteExistingProduct(id);
      expect(productModel.deleteProductById).toHaveBeenCalledWith(id);
    });
  });

  describe('getProductsByCategoryService', () => {
    it('should return paginated products by category', async () => {
      const category = 'electronics';
      const mockProducts = [{ id: 1, title: 'Product 1', category }];
      const mockTotal = 5;
      
      productModel.fetchProductsByCategory.mockResolvedValue({
        products: mockProducts,
        total: mockTotal,
        totalPages: 1,
        currentPage: 1
      });
      
      const result = await getProductsByCategoryService(category, 1);
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(mockTotal);
      expect(productModel.fetchProductsByCategory).toHaveBeenCalledWith(category, 1);
    });

    it('should use default page if not provided', async () => {
      const category = 'electronics';
      productModel.fetchProductsByCategory.mockResolvedValue({
        products: [],
        total: 0,
        totalPages: 0,
        currentPage: 1
      });
      
      await getProductsByCategoryService(category);
      expect(productModel.fetchProductsByCategory).toHaveBeenCalledWith(category, 1);
    });
  });
});
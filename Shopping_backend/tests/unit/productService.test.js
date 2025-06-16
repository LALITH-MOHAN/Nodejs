import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCategories,
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProductsByCategoryService
} from '../../services/productService.js';
import * as productModel from '../../model/productModel.js';

describe('Product Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCategories', () => {
    it('should return categories from model', async () => {
      // Mock the model function
      vi.spyOn(productModel, 'fetchAllCategories').mockResolvedValue(['Electronics', 'Clothing']);
      
      const result = await getCategories();
      expect(result).toEqual(['Electronics', 'Clothing']);
      expect(productModel.fetchAllCategories).toHaveBeenCalled();
    });

    it('should handle empty categories', async () => {
      vi.spyOn(productModel, 'fetchAllCategories').mockResolvedValue([]);
      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = {
        products: [{ id: 1, title: 'Test' }],
        total: 1,
        totalPages: 1,
        currentPage: 1
      };
      vi.spyOn(productModel, 'fetchAllProducts').mockResolvedValue(mockProducts);
      
      const result = await getProducts(1);
      expect(result).toEqual(mockProducts);
    });
  });

  // Add tests for other service functions
});
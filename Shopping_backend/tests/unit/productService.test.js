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
import Product from '../../models/productModel.js';

// Mock the Product model
vi.mock('../../models/productModel.js', () => {
  const Product = {
    findAll: vi.fn(),
    findAndCountAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn()
  };
  return { default: Product };
});

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = {
        rows: [
          { id: 1, title: 'Product 1', price: 10.99 },
          { id: 2, title: 'Product 2', price: 20.99 }
        ],
        count: 2
      };
      
      Product.findAndCountAll.mockResolvedValue(mockProducts);

      const result = await getProducts(1);
      expect(result.products).toEqual(mockProducts.rows);
      expect(result.total).toBe(2);
      expect(Product.findAndCountAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        limit: 9,
        offset: 0,
        raw: true
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: 1, title: 'Test Product', price: 99.99 };
      Product.findByPk.mockResolvedValue(mockProduct);

      const result = await getProduct(1);
      expect(result).toEqual(mockProduct);
      expect(Product.findByPk).toHaveBeenCalledWith(1, {
        attributes: expect.any(Array),
        raw: true
      });
    });

    it('should return null for non-existent product', async () => {
      Product.findByPk.mockResolvedValue(null);
      const result = await getProduct(999);
      expect(result).toBeNull();
    });
  });

  describe('createNewProduct', () => {
    it('should create and return a new product', async () => {
      const newProduct = { title: 'New Product', price: 49.99 };
      const createdProduct = { id: 3, ...newProduct };
      
      Product.create.mockResolvedValue({ id: 3 });
      Product.findByPk.mockResolvedValue(createdProduct);

      const result = await createNewProduct(newProduct);
      expect(result).toEqual(createdProduct);
      expect(Product.create).toHaveBeenCalledWith(newProduct);
      expect(Product.findByPk).toHaveBeenCalledWith(3, {
        attributes: expect.any(Array),
        raw: true
      });
    });
  });

  describe('updateExistingProduct', () => {
    it('should update and return the product', async () => {
      const updatedProduct = { id: 1, title: 'Updated Product', price: 59.99 };
      
      Product.update.mockResolvedValue([1]);
      Product.findByPk.mockResolvedValue(updatedProduct);

      const result = await updateExistingProduct(1, { title: 'Updated Product' });
      expect(result).toEqual(updatedProduct);
      expect(Product.update).toHaveBeenCalledWith(
        { title: 'Updated Product' },
        { where: { id: 1 } }
      );
    });
  });

  describe('deleteExistingProduct', () => {
    it('should delete the product', async () => {
      Product.destroy.mockResolvedValue(1);
      await deleteExistingProduct(1);
      expect(Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getProductsByCategoryService', () => {
    it('should return products filtered by category', async () => {
      const mockProducts = {
        rows: [
          { id: 1, title: 'Electronics 1', category: 'electronics' },
          { id: 2, title: 'Electronics 2', category: 'electronics' }
        ],
        count: 2
      };
      
      Product.findAndCountAll.mockResolvedValue(mockProducts);

      const result = await getProductsByCategoryService('electronics', 1);
      expect(result.products).toEqual(mockProducts.rows);
      expect(Product.findAndCountAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        where: { category: 'electronics' },
        limit: 9,
        offset: 0,
        raw: true
      });
    });
  });
});
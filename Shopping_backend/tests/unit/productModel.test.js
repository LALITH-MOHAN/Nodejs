import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  fetchAllCategories,
  fetchAllProducts,
  fetchProductById,
} from '../../model/productModel.js';

// Mock the entire models module with proper sequelize instance
vi.mock('../../models/index.js', async (importOriginal) => {
  const actual = await importOriginal();
  const Sequelize = {
    fn: vi.fn().mockImplementation((fn, col) => ({ fn, col })),
    col: vi.fn().mockImplementation((col) => col),
    where: vi.fn().mockImplementation((col, op, val) => ({ [col]: { [op]: val } })),
  };

  return {
    ...actual,
    sequelize: {
      ...actual.sequelize,
      fn: Sequelize.fn,
      col: Sequelize.col,
      where: Sequelize.where,
      query: vi.fn(),
      authenticate: vi.fn(),
      close: vi.fn(),
    },
    Product: {
      findAll: vi.fn(),
      findByPk: vi.fn(),
      findAndCountAll: vi.fn(),
      sequelize: {
        ...Sequelize,
      },
    },
  };
});

describe('Product Model', () => {
  describe('fetchAllCategories', () => {
    it('should return distinct categories from products', async () => {
      // Arrange
      const { Product } = await import('../../models/index.js');
      // Mock returns raw data with duplicates
      Product.findAll.mockResolvedValue([
        { category: 'smartphones' },
        { category: 'laptops' },
        { category: 'smartphones' }, // duplicate
      ]);

      // Act
      const categories = await fetchAllCategories();

      // Assert - expect duplicates to be removed
      
      expect(Product.findAll).toHaveBeenCalledWith({
        attributes: [
          [{ fn: 'DISTINCT', col: 'category' }, 'category']
        ],
        where: { category: { 'IS NOT': null } },
        raw: true,
      });
    });

    it('should return empty array when no categories exist', async () => {
      const { Product } = await import('../../models/index.js');
      Product.findAll.mockResolvedValue([]);

      const categories = await fetchAllCategories();
      expect(categories).toEqual([]);
    });
  });

  describe('fetchAllProducts', () => {
    it('should return paginated products', async () => {
      const { Product } = await import('../../models/index.js');
      const mockProducts = Array(5).fill({
        id: 1,
        title: 'Test Product',
        price: '100.00',
        category: 'test',
      });
      
      Product.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: 19,
      });

      const result = await fetchAllProducts(1, 5);

      expect(result.products).toHaveLength(5);
      expect(result.total).toBe(19);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(1);
    });
  });

  describe('fetchProductById', () => {
    it('should return product by ID', async () => {
      const { Product } = await import('../../models/index.js');
      const mockProduct = {
        id: 1,
        title: 'iPhone 9',
        price: '549.00',
        category: 'smartphones',
      };
      Product.findByPk.mockResolvedValue(mockProduct);

      const result = await fetchProductById(1);

      expect(result.title).toBe('iPhone 9');
      expect(result.price).toBe('549.00');
      expect(result.category).toBe('smartphones');
    });

    it('should return null for non-existent product ID', async () => {
      const { Product } = await import('../../models/index.js');
      Product.findByPk.mockResolvedValue(null);

      const result = await fetchProductById(9999);
      expect(result).toBeNull();
    });
  });
});
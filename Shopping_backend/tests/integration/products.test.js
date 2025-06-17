import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

vi.mock('../../middleware/authMiddleware.js', () => ({
  authenticate: vi.fn((req, res, next) => next()),
  authorizeAdmin: vi.fn((req, res, next) => next())
}));

vi.mock('../../services/productService.js', () => {
  const mockProduct = {
    id: 2,
    title: 'iPhone X',
    price: 898.00, 
    category: 'smartphones',
    stock: 27,
    description: 'Model A19211 6.5-inch Super Retina HD display',
    thumbnail: '/products/iPhoneX.jpg'
  };

  return {
    getCategories: vi.fn().mockResolvedValue(['smartphones', 'laptops', 'fragrances', 'beauty', 'kitchen-accessories', 'HOME', 'electronics']),
    getProducts: vi.fn().mockResolvedValue({
      products: [mockProduct],
      total: 1,
      totalPages: 1,
      currentPage: 1
    }),
    getProduct: vi.fn().mockImplementation((id) => {
      if (id === '2') { 
        return Promise.resolve(mockProduct);
      }
      return Promise.resolve(null);
    }),
    createNewProduct: vi.fn().mockImplementation((data) => {
      if (!data.title) {
        throw { 
          name: 'ValidationError', 
          message: 'Validation error',
          errors: [{ path: 'title', message: 'Title is required' }] 
        };
      }
      return Promise.resolve({
        id: 22,
        ...data,
        thumbnail: null
      });
    }),
    updateExistingProduct: vi.fn().mockResolvedValue(mockProduct),
    deleteExistingProduct: vi.fn().mockResolvedValue(true),
    getProductsByCategoryService: vi.fn().mockResolvedValue({
      products: [mockProduct],
      total: 1,
      totalPages: 1,
      currentPage: 1
    })
  };
});

describe('Product API Tests (Fully Mocked)', () => {
  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=5')
        .expect(200);

      expect(response.body).toEqual({
        products: [{
          id: 2,
          title: 'iPhone X',
          price: 898.00,
          category: 'smartphones',
          stock: 27,
          description: 'Model A19211 6.5-inch Super Retina HD display',
          thumbnail: '/products/iPhoneX.jpg'
        }],
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product details', async () => {
      const response = await request(app)
        .get('/api/products/2')
        .expect(200);

      expect(response.body).toEqual({
        id: 2,
        title: 'iPhone X',
        price: 898.00,
        category: 'smartphones',
        stock: 27,
        description: 'Model A19211 6.5-inch Super Retina HD display',
        thumbnail: '/products/iPhoneX.jpg'
      });
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toEqual({
        message: 'Product not found'
      });
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(response.body).toEqual([
        'smartphones', 
        'laptops', 
        'fragrances', 
        'beauty', 
        'kitchen-accessories', 
        'HOME', 
        'electronics'
      ]);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'New Product',
        price: 49.99,
        category: 'electronics',
        stock: 5,
        description: 'New product description'
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);

      expect(response.body).toEqual({
        id: 22,
        title: 'New Product',
        price: 49.99,
        category: 'electronics',
        stock: 5,
        description: 'New product description',
        thumbnail: null
      });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const updates = {
        title: 'Updated iPhone X',
        price: 999.99
      };

      const response = await request(app)
        .put('/api/products/2')
        .send(updates)
        .expect(200);

      expect(response.body).toEqual({
        id: 2,
        title: 'iPhone X',
        price: 898.00,
        category: 'smartphones',
        stock: 27,
        description: 'Model A19211 6.5-inch Super Retina HD display',
        thumbnail: '/products/iPhoneX.jpg'
      });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      await request(app)
        .delete('/api/products/2')
        .expect(200);
    });
  });
});
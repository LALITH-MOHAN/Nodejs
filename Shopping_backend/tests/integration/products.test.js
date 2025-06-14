import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

// Mock the product service
vi.mock('../../services/productService.js', () => ({
  getCategories: vi.fn(),
  getProducts: vi.fn(),
  getProduct: vi.fn(),
  createNewProduct: vi.fn(),
  updateExistingProduct: vi.fn(),
  deleteExistingProduct: vi.fn(),
  getProductsByCategoryService: vi.fn()
}));

// Mock the auth middleware
vi.mock('../../middleware/authMiddleware.js', () => ({
  authenticate: vi.fn((req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  }),
  authorizeAdmin: vi.fn((req, res, next) => next())
}));

// Import after mocking
import * as productService from '../../services/productService.js';
import * as authMiddleware from '../../middleware/authMiddleware.js';

const testProduct = {
  id: 1,
  title: 'Test Product',
  price: 100,
  thumbnail: 'test.jpg',
  stock: 10,
  description: 'Test description',
  category: 'electronics'
};

const testProducts = [
  testProduct,
  { ...testProduct, id: 2, title: 'Test Product 2' }
];

describe('Product API Endpoints', () => {
  beforeAll(() => {
    // Setup mock implementations
    productService.getCategories.mockResolvedValue(['laptops', 'smartphones']);
    productService.getProducts.mockResolvedValue({
      products: testProducts,
      total: 2,
      totalPages: 1,
      currentPage: 1
    });
    productService.getProduct.mockImplementation(async (id) => 
      testProducts.find(p => p.id === parseInt(id)) || null);
    productService.createNewProduct.mockImplementation(async (data) => ({
      ...data,
      id: 3
    }));
    productService.updateExistingProduct.mockImplementation(async (id, data) => ({
      ...testProduct,
      ...data,
      id: parseInt(id)
    }));
    productService.deleteExistingProduct.mockResolvedValue();
    productService.getProductsByCategoryService.mockResolvedValue({
      products: [testProduct],
      total: 1,
      totalPages: 1,
      currentPage: 1
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/products/categories', () => {
    it('should return all product categories', async () => {
      const res = await request(app).get('/api/products/categories');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['laptops', 'smartphones']);
      expect(productService.getCategories).toHaveBeenCalled();
    });
  });

  describe('GET /api/products', () => {
    it('should return all products with pagination', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({ page: 1 });
      
      expect(res.status).toBe(200);
      expect(res.body.products).toEqual(testProducts);
      expect(res.body.total).toBe(2);
      expect(productService.getProducts).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(testProduct);
      expect(productService.getProduct).toHaveBeenCalledWith('1');
    });

    it('should return 404 for non-existent product', async () => {
      productService.getProduct.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'New Product',
        price: 200,
        thumbnail: 'new.jpg',
        stock: 5,
        description: 'New description',
        category: 'clothing'
      };
      
      const res = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ ...newProduct, id: 3 });
      expect(productService.createNewProduct).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updates = { title: 'Updated Product', price: 150 };
      const res = await request(app)
        .put('/api/products/1')
        .send(updates);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ...testProduct, ...updates, id: 1 });
      expect(productService.updateExistingProduct).toHaveBeenCalledWith('1', updates);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const res = await request(app).delete('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted successfully');
      expect(productService.deleteExistingProduct).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /api/products/category/:category', () => {
    it('should return products by category with pagination', async () => {
      const res = await request(app)
        .get('/api/products/category/electronics')
        .query({ page: 1 });
      
      expect(res.status).toBe(200);
      expect(res.body.products).toEqual([testProduct]);
      expect(res.body.total).toBe(1);
      expect(productService.getProductsByCategoryService)
        .toHaveBeenCalledWith('electronics', 1);
    });
  });
});
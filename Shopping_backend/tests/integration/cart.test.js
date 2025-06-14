import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import * as cartService from '../../services/cartService.js';

// Mock the cart service
vi.mock('../../services/cartService.js');

// Properly mock the auth middleware with both required functions
vi.mock('../../middleware/authMiddleware.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    authenticate: vi.fn((req, res, next) => {
      req.user = { id: 1, role: 'customer' };
      next();
    }),
    authorizeAdmin: vi.fn((req, res, next) => next())
  };
});

const mockCartItems = [
  {
    id: 1,
    product_id: 1,
    quantity: 2,
    title: 'Test Product',
    price: 100,
    thumbnail: 'test.jpg',
    stock: 10
  }
];

describe('Cart API Endpoints', () => {
  beforeAll(() => {
    // Setup mock implementations
    cartService.fetchCart.mockResolvedValue(mockCartItems);
    cartService.addItem.mockResolvedValue(mockCartItems);
    cartService.updateItem.mockResolvedValue(mockCartItems);
    cartService.removeItem.mockResolvedValue([]);
    cartService.clearUserCart.mockResolvedValue([]);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should return user cart items', async () => {
      const res = await request(app).get('/api/cart');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCartItems);
      expect(cartService.fetchCart).toHaveBeenCalledWith(1);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const newItem = { productId: 1, quantity: 1 };
      const res = await request(app)
        .post('/api/cart')
        .send(newItem);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCartItems);
      expect(cartService.addItem).toHaveBeenCalledWith(1, newItem.productId, newItem.quantity);
    });

    it('should return 400 for invalid request', async () => {
      cartService.addItem.mockRejectedValueOnce(new Error('Invalid request'));
      
      const res = await request(app)
        .post('/api/cart')
        .send({});
      
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/cart/:productId', () => {
    it('should update item quantity', async () => {
      const updates = { quantity: 3 };
      const res = await request(app)
        .put('/api/cart/1')
        .send(updates);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCartItems);
      expect(cartService.updateItem).toHaveBeenCalledWith(1, '1', updates.quantity);
    });
  });

  describe('DELETE /api/cart/:productId', () => {
    it('should remove item from cart', async () => {
      const res = await request(app).delete('/api/cart/1');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(cartService.removeItem).toHaveBeenCalledWith(1, '1');
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear user cart', async () => {
      const res = await request(app).delete('/api/cart');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(cartService.clearUserCart).toHaveBeenCalledWith(1);
    });
  });
});
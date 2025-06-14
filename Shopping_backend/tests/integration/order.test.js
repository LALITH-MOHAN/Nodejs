import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import * as orderService from '../../services/orderService.js';

// Mock services and middleware
vi.mock('../../services/orderService.js');
vi.mock('../../middleware/authMiddleware.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    authenticate: vi.fn((req, res, next) => {
      req.user = { id: 1, role: 'customer' };
      next();
    })
  };
});

const mockOrder = {
  id: 1,
  userId: 1,
  total: 100,
  status: 'pending',
  date: new Date().toISOString(),
  items: [
    {
      id: 1,
      title: 'Test Product',
      price: 50,
      quantity: 2,
      thumbnail: 'test.jpg'
    }
  ]
};

const mockOrdersResponse = {
  orders: [mockOrder],
  total: 1,
  totalPages: 1,
  currentPage: 1
};

describe('Order API Endpoints', () => {
  beforeAll(() => {
    // Setup mock implementations
    orderService.placeUserOrder.mockResolvedValue(mockOrder);
    orderService.fetchUserOrders.mockResolvedValue(mockOrdersResponse);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        items: [
          {
            id: 1,
            title: 'Test Product',
            price: 50,
            quantity: 2,
            thumbnail: 'test.jpg'
          }
        ],
        total: 100
      };

      const res = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual([mockOrder]);
      expect(orderService.placeUserOrder).toHaveBeenCalledWith(1, orderData.items, orderData.total);
    });

    it('should return 400 for empty cart', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: [], total: 0 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Cart is empty');
    });
  });

  describe('GET /api/orders', () => {
    it('should return user orders with pagination', async () => {
      const res = await request(app)
        .get('/api/orders')
        .query({ page: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        orders: mockOrdersResponse.orders,
        pagination: {
          total: mockOrdersResponse.total,
          totalPages: mockOrdersResponse.totalPages,
          currentPage: mockOrdersResponse.currentPage
        }
      });
      expect(orderService.fetchUserOrders).toHaveBeenCalledWith(1, 1, 10);
    });

    it('should use default page if not provided', async () => {
      const res = await request(app).get('/api/orders');
      expect(orderService.fetchUserOrders).toHaveBeenCalledWith(1, 1, 10);
    });
  });
});
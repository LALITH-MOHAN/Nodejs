import { describe, it, expect, vi, beforeEach } from 'vitest';
import db from '../../config/db.js';
import * as orderModel from '../../models/orderModel.js';

vi.mock('../../config/db.js');

describe('Order Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const userId = 1;
  const items = [
    {
      id: 1,
      title: 'iPhone X',
      price: 898.00,
      quantity: 2,
      thumbnail: 'test.jpg'
    }
  ];
  const total = 100;

  describe('createOrder', () => {
    it('should create an order with transaction', async () => {
      const mockDate = new Date();
      const mockConn = {
        beginTransaction: vi.fn(),
        query: vi.fn()
          // First query - order creation
          .mockResolvedValueOnce([{ insertId: 1 }]) 
          // Second query - product check (FOR UPDATE)
          .mockResolvedValueOnce([[{ stock: 10 }]]) 
          // Third query - item insertion
          .mockResolvedValueOnce([{}]) 
          // Fourth query - stock update
          .mockResolvedValueOnce([{}]) 
          // Fifth query - order fetch
          .mockResolvedValueOnce([[{ 
            id: 1, 
            total: '100.00', 
            status: 'pending',
            date: mockDate 
          }]]) 
          // Sixth query - items fetch
          .mockResolvedValueOnce([[{ 
            id: 1,
            title: 'Test Product',
            price: '50.00',
            quantity: 2,
            thumbnail: 'test.jpg'
          }]]), 
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn()
      };
      
      db.getConnection.mockResolvedValue(mockConn);

      const result = await orderModel.createOrder(userId, total, items);
      
      expect(result).toEqual({
        id: 1,
        total: 100,
        status: 'pending',
        date: mockDate.toISOString(),
        items: [{
          id: 1,
          title: 'Test Product',
          price: 50,
          quantity: 2,
          thumbnail: 'test.jpg'
        }]
      });
      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.commit).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const mockConn = {
        beginTransaction: vi.fn(),
        query: vi.fn().mockRejectedValue(new Error('DB error')),
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn()
      };
      
      db.getConnection.mockResolvedValue(mockConn);

      await expect(orderModel.createOrder(userId, total, items))
        .rejects.toThrow('DB error');
      expect(mockConn.rollback).toHaveBeenCalled();
    });

    it('should throw error when product not found', async () => {
      const mockConn = {
        beginTransaction: vi.fn(),
        query: vi.fn()
          .mockResolvedValueOnce([{ insertId: 1 }])
          .mockResolvedValueOnce([[]]), // Empty array for product
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn()
      };
      
      db.getConnection.mockResolvedValue(mockConn);

      await expect(orderModel.createOrder(userId, total, items))
        .rejects.toThrow('Product 1 not found');
      expect(mockConn.rollback).toHaveBeenCalled();
    });

    it('should throw error when insufficient stock', async () => {
      const mockConn = {
        beginTransaction: vi.fn(),
        query: vi.fn()
          .mockResolvedValueOnce([{ insertId: 1 }])
          .mockResolvedValueOnce([[{ stock: 1 }]]), // Only 1 in stock
        commit: vi.fn(),
        rollback: vi.fn(),
        release: vi.fn()
      };
      
      db.getConnection.mockResolvedValue(mockConn);

      await expect(orderModel.createOrder(userId, total, items))
        .rejects.toThrow('Not enough stock for product 1');
      expect(mockConn.rollback).toHaveBeenCalled();
    });
  });

  describe('getUserOrders', () => {
    it('should return paginated orders with grouped items', async () => {
      const mockDate = new Date();
      const mockRows = [{
        id: 1,
        userId: 1,
        total: '100.00',
        status: 'pending',
        date: mockDate,
        productId: 1,
        title: 'Test Product',
        price: '50.00',
        quantity: 2,
        thumbnail: 'test.jpg'
      }];
      
      const mockCount = [[{ total: 1 }]]; // Note the double array structure
      
      db.query
        .mockResolvedValueOnce([mockRows]) // Orders query
        .mockResolvedValueOnce(mockCount); // Count query

      const result = await orderModel.getUserOrders(userId, 1, 10);
      
      expect(result).toEqual({
        orders: [{
          id: 1,
          userId: 1,
          total: 100,
          status: 'pending',
          date: mockDate.toISOString(),
          items: [{
            id: 1,
            title: 'Test Product',
            price: 50,
            quantity: 2,
            thumbnail: 'test.jpg'
          }]
        }],
        total: 1,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should handle empty results', async () => {
      db.query
        .mockResolvedValueOnce([[]]) // Empty orders
        .mockResolvedValueOnce([[{ total: 0 }]]); // Count = 0

      const result = await orderModel.getUserOrders(userId, 1, 10);
      
      expect(result).toEqual({
        orders: [],
        total: 0,
        totalPages: 0,
        currentPage: 1
      });
    });
  });
});
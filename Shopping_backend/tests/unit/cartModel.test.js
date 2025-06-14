import { describe, it, expect, vi, beforeEach } from 'vitest';
import db from '../../config/db.js';
import * as cartModel from '../../models/cartModel.js';

vi.mock('../../config/db.js');

describe('Cart Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const userId = 1;
  const productId = 1;
  const quantity = 2;

  describe('getCartItems', () => {
    it('should return cart items with product details', async () => {
      const mockItems = [{ id: 1, product_id: 1, quantity: 2 }];
      db.query.mockResolvedValueOnce([mockItems]);

      const result = await cartModel.getCartItems(userId);
      expect(result).toEqual(mockItems);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [userId]);
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const mockItems = [{ id: 1, product_id: 1, quantity: 2 }];
      
      // Mock product check
      db.query.mockResolvedValueOnce([[{ stock: 10 }]]);
      // Mock existing item check
      db.query.mockResolvedValueOnce([[]]);
      // Mock insert
      db.query.mockResolvedValueOnce([{}]);
      // Mock get cart items
      db.query.mockResolvedValueOnce([mockItems]);

      const result = await cartModel.addToCart(userId, productId, quantity);
      expect(result).toEqual(mockItems);
      expect(db.query).toHaveBeenCalledTimes(4);
    });

    it('should update quantity if item exists', async () => {
      const mockItems = [{ id: 1, product_id: 1, quantity: 3 }];
      
      // Mock product check
      db.query.mockResolvedValueOnce([[{ stock: 10 }]]);
      // Mock existing item check
      db.query.mockResolvedValueOnce([[{ quantity: 1 }]]);
      // Mock update
      db.query.mockResolvedValueOnce([{}]);
      // Mock get cart items
      db.query.mockResolvedValueOnce([mockItems]);

      const result = await cartModel.addToCart(userId, productId, 2);
      expect(result).toEqual(mockItems);
    });
  });

  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      const mockItems = [{ id: 1, product_id: 1, quantity: 3 }];
      
      // Mock product check
      db.query.mockResolvedValueOnce([[{ stock: 10 }]]);
      // Mock update
      db.query.mockResolvedValueOnce([{}]);
      // Mock get cart items
      db.query.mockResolvedValueOnce([mockItems]);

      const result = await cartModel.updateCartItem(userId, productId, 3);
      expect(result).toEqual(mockItems);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockItems = [];
      
      // Mock delete
      db.query.mockResolvedValueOnce([{}]);
      // Mock get cart items
      db.query.mockResolvedValueOnce([mockItems]);

      const result = await cartModel.removeFromCart(userId, productId);
      expect(result).toEqual(mockItems);
    });
  });

  describe('clearCart', () => {
    it('should clear user cart', async () => {
      // Mock delete
      db.query.mockResolvedValueOnce([{}]);

      const result = await cartModel.clearCart(userId);
      expect(result).toEqual([]);
    });
  });
});
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import http from 'http';
import app from '../app.js'; 

let server;

beforeAll(() => {
  server = http.createServer(app);
});

describe('Product Routes', () => {
  it('GET /products - should return all products', async () => {
    const res = await request(server).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /products/:id - should return product by ID', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      thumbnail: 'https://via.placeholder.com/150',
      stock: 5,
      description: 'Temporary product for GET test',
      category: 'test'
    };
  
    // Create a new product
    const createRes = await request(server).post('/products').send(newProduct);
    const productId = createRes.body.id;
  
    // Fetch the same product
    const res = await request(server).get(`/products/${productId}`);
    expect(res.statusCode).toBe(200);
   expect(res.body).toHaveProperty('id', productId);
  });

  it('POST /products - should create a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 100.0,
      thumbnail: 'https://via.placeholder.com/150',
      stock: 10,
      description: 'Test Description',
      category: 'test'
    };
    const res = await request(server).post('/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /products/:id - should update a product', async () => {
    const update = {
      name: 'Updated Product',
      price: 120.0,
      thumbnail: 'https://via.placeholder.com/200',
      stock: 15,
      description: 'Updated description',
      category: 'updated'
    };
    const res = await request(server).put('/products/1').send(update);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product updated');
  });

  it('DELETE /products/:id - should delete a product', async () => {
    const res = await request(server).delete('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted');
  });
});

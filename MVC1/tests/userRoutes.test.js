import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRoutes from '../route/userRoutes.js';
import * as userModel from '../model/userModel.js';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('User API', () => {
  beforeEach(() => {userModel.resetUsers([  { id: 1, name: 'Alice' },  { id: 2, name: 'Bob' }]); });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should create a user', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Charlie' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Charlie');
  });

  it('should update a user', async () => {
    const res = await request(app).put('/api/users/1').send({ name: 'Updated Alice' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Alice');
  });

  it('should delete a user', async () => {
    const res = await request(app).delete('/api/users/1');
    expect(res.statusCode).toBe(204);
  });
});

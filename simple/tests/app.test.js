import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /greet', () => {
  it('should respond with a greeting for provided name', async () => {
    const res = await request(app).get('/greet?name=Alice');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello, Alice!' });
  });

  it('should respond with default greeting when no name is provided', async () => {
    const res = await request(app).get('/greet');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello, Guest!' });
  });
});

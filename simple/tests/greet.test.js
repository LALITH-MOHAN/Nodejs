import { describe, it, expect } from 'vitest';
import { getGreeting } from '../greet.js';

describe('getGreeting', () => {
  it('returns greeting with name', () => {
    expect(getGreeting('Alice')).toBe('Hello, Alice!');
  });

  it('returns greeting for Guest when no name is given', () => {
    expect(getGreeting()).toBe('Hello, Guest!');
  });
});

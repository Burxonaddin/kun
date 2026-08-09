import { describe, expect, it } from 'vitest';
import { Rng, hashSeed } from '../prng';

describe('Rng', () => {
  it('is reproducible for a given seed', () => {
    const a = new Rng(123);
    const b = new Rng(123);
    const first = Array.from({ length: 20 }, () => a.next());
    const second = Array.from({ length: 20 }, () => b.next());
    expect(first).toEqual(second);
  });

  it('produces different streams for different seeds', () => {
    const a = Array.from({ length: 10 }, () => new Rng(1).next());
    const b = Array.from({ length: 10 }, () => new Rng(2).next());
    expect(a[0]).not.toEqual(b[0]);
  });

  it('keeps floats in [0, 1) and ints within bounds', () => {
    const rng = new Rng(9);
    for (let i = 0; i < 2000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      const int = rng.int(3, 7);
      expect(int).toBeGreaterThanOrEqual(3);
      expect(int).toBeLessThanOrEqual(7);
    }
  });

  it('samples distinct items and never more than the pool size', () => {
    const rng = new Rng(5);
    const pool = ['a', 'b', 'c', 'd'];
    const sample = rng.sample(pool, 3);
    expect(new Set(sample).size).toBe(3);
    expect(rng.sample(pool, 99)).toHaveLength(4);
  });

  it('shuffles without losing or duplicating items', () => {
    const rng = new Rng(77);
    const pool = Array.from({ length: 30 }, (_, i) => i);
    const shuffled = rng.shuffle(pool);
    expect(shuffled).toHaveLength(30);
    expect([...shuffled].sort((x, y) => x - y)).toEqual(pool);
    expect(shuffled).not.toEqual(pool);
  });

  it('throws when picking from an empty list', () => {
    expect(() => new Rng(1).pick([])).toThrow();
  });

  it('hashes seeds deterministically and distinctly', () => {
    expect(hashSeed('mock', 1)).toBe(hashSeed('mock', 1));
    expect(hashSeed('mock', 1)).not.toBe(hashSeed('mock', 2));
  });
});

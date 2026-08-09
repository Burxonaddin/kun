import { beforeEach, describe, expect, it } from 'vitest';
import {
  currentUser, getResults, hashPassword, loginUser, logout, registerUser, resetStorage, saveResult,
  validateRegistration,
} from '../storage';
import type { AttemptResult } from '../../types';

const VALID = {
  name: 'Test Talaba',
  email: 'Talaba@Example.com',
  password: 'mockexam1',
  country: 'Uzbekistan',
  targetBand: 7,
};

beforeEach(() => {
  resetStorage();
});

describe('registration validation', () => {
  it('accepts a well formed registration', () => {
    expect(validateRegistration(VALID)).toBeNull();
  });

  it('rejects a missing name, bad email, short password and impossible target', () => {
    expect(validateRegistration({ ...VALID, name: '  ' })).toBeTruthy();
    expect(validateRegistration({ ...VALID, email: 'not-an-email' })).toBeTruthy();
    expect(validateRegistration({ ...VALID, password: 'short1' })).toBeTruthy();
    expect(validateRegistration({ ...VALID, password: 'onlyletters' })).toBeTruthy();
    expect(validateRegistration({ ...VALID, targetBand: 12 })).toBeTruthy();
  });
});

describe('accounts', () => {
  it('registers a user, lower-cases the email and signs them in', () => {
    const { user, error } = registerUser(VALID);
    expect(error).toBeUndefined();
    expect(user?.email).toBe('talaba@example.com');
    expect(currentUser()?.email).toBe('talaba@example.com');
  });

  it('never stores the raw password', () => {
    const { user } = registerUser(VALID);
    expect(user?.passwordHash).not.toContain(VALID.password);
    expect(user?.passwordHash).toHaveLength(16);
    expect(user?.salt.length).toBeGreaterThan(8);
  });

  it('refuses a duplicate email', () => {
    registerUser(VALID);
    const second = registerUser({ ...VALID, email: 'talaba@example.com' });
    expect(second.error).toBeTruthy();
    expect(second.user).toBeUndefined();
  });

  it('logs in with the right password and rejects the wrong one', () => {
    registerUser(VALID);
    logout();
    expect(currentUser()).toBeNull();
    expect(loginUser('talaba@example.com', 'wrongpass1').error).toBeTruthy();
    expect(loginUser('nobody@example.com', 'mockexam1').error).toBeTruthy();
    const ok = loginUser('talaba@example.com', VALID.password);
    expect(ok.user?.name).toBe('Test Talaba');
    expect(currentUser()).not.toBeNull();
  });

  it('salts the hash so identical passwords differ between users', () => {
    const a = hashPassword('mockexam1', 'salt-one');
    const b = hashPassword('mockexam1', 'salt-two');
    expect(a).not.toBe(b);
    expect(hashPassword('mockexam1', 'salt-one')).toBe(a);
  });
});

describe('results history', () => {
  function attempt(email: string, overall: number): AttemptResult {
    return {
      id: `${email}-${overall}`,
      mockId: 1,
      mockCode: 'IELTS-0001',
      userEmail: email,
      finishedAt: Date.now(),
      sections: [],
      overall,
      strengths: [],
      weaknesses: [],
      advice: [],
    };
  }

  it('stores results per user and returns the newest first', () => {
    saveResult(attempt('a@example.com', 6));
    saveResult(attempt('a@example.com', 7));
    saveResult(attempt('b@example.com', 5));
    const mine = getResults('a@example.com');
    expect(mine).toHaveLength(2);
    expect(mine[0].overall).toBe(7);
    expect(getResults('b@example.com')).toHaveLength(1);
    expect(getResults('c@example.com')).toHaveLength(0);
  });
});

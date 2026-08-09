import type { AttemptResult, User } from '../types';

const USERS_KEY = 'ielts.users';
const SESSION_KEY = 'ielts.session';
const RESULTS_KEY = 'ielts.results';

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function memoryStore(): Store {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
}

const fallback = memoryStore();

function store(): Store {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // Access to localStorage can throw in private browsing modes.
  }
  return fallback;
}

function read<T>(key: string, initial: T): T {
  const raw = store().getItem(key);
  if (!raw) return initial;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initial;
  }
}

function write(key: string, value: unknown): void {
  store().setItem(key, JSON.stringify(value));
}

/** Small dependency-free password hash. Adequate for a browser-only demo account store. */
export function hashPassword(password: string, salt: string): string {
  const input = `${salt}:${password}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
    h2 = Math.imul(h2 + code + i, 2246822519) >>> 0;
  }
  // A few extra rounds so the digest does not fall out of a single pass.
  for (let round = 0; round < 512; round++) {
    h1 = Math.imul(h1 ^ (h2 >>> 13), 2654435761) >>> 0;
    h2 = Math.imul(h2 ^ (h1 >>> 7), 40503) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

export function makeSalt(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getUsers(): User[] {
  return read<User[]>(USERS_KEY, []);
}

export function findUser(email: string): User | undefined {
  const target = email.trim().toLowerCase();
  return getUsers().find((user) => user.email === target);
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
  country: string;
  targetBand: number;
}

export function validateRegistration(input: RegisterInput): string | null {
  if (!input.name.trim()) return 'Ismingizni kiriting.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return 'Email manzili noto\u2018g\u2018ri.';
  if (input.password.length < 8) return 'Parol kamida 8 ta belgidan iborat bo\u2018lishi kerak.';
  if (!/[0-9]/.test(input.password) || !/[a-zA-Z]/.test(input.password)) {
    return 'Parolda kamida bitta harf va bitta raqam bo\u2018lishi kerak.';
  }
  if (input.targetBand < 1 || input.targetBand > 9) return 'Maqsadli ball 1 va 9 oralig\u2018ida bo\u2018lishi kerak.';
  return null;
}

export function registerUser(input: RegisterInput): { user?: User; error?: string } {
  const error = validateRegistration(input);
  if (error) return { error };
  const email = input.email.trim().toLowerCase();
  if (findUser(email)) return { error: 'Bu email allaqachon ro\u2018yxatdan o\u2018tgan.' };
  const salt = makeSalt();
  const user: User = {
    email,
    name: input.name.trim(),
    country: input.country.trim() || 'Uzbekistan',
    targetBand: input.targetBand,
    createdAt: Date.now(),
    salt,
    passwordHash: hashPassword(input.password, salt),
  };
  write(USERS_KEY, [...getUsers(), user]);
  write(SESSION_KEY, user.email);
  return { user };
}

export function loginUser(email: string, password: string): { user?: User; error?: string } {
  const user = findUser(email);
  if (!user) return { error: 'Bunday foydalanuvchi topilmadi.' };
  if (hashPassword(password, user.salt) !== user.passwordHash) return { error: 'Parol noto\u2018g\u2018ri.' };
  write(SESSION_KEY, user.email);
  return { user };
}

export function currentUser(): User | null {
  const email = read<string | null>(SESSION_KEY, null);
  if (!email) return null;
  return findUser(email) ?? null;
}

export function logout(): void {
  store().removeItem(SESSION_KEY);
}

export function saveResult(result: AttemptResult): void {
  const results = read<AttemptResult[]>(RESULTS_KEY, []);
  write(RESULTS_KEY, [result, ...results].slice(0, 200));
}

export function getResults(email: string): AttemptResult[] {
  return read<AttemptResult[]>(RESULTS_KEY, []).filter((r) => r.userEmail === email);
}

/** Test hook: clears every key this module owns. */
export function resetStorage(): void {
  store().removeItem(USERS_KEY);
  store().removeItem(SESSION_KEY);
  store().removeItem(RESULTS_KEY);
}

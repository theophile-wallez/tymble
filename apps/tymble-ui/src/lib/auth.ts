import type { LoginResponse } from '@/api/auth';

type AuthUser = LoginResponse['user'];

const STORAGE_KEY = 'tymble:auth-user';
const isBrowser = typeof window !== 'undefined';

function readStoredUser(): AuthUser | null {
  if (!isBrowser) {
    return null;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

class AuthStore {
  private user: AuthUser | null;

  constructor() {
    this.user = readStoredUser();
  }

  isAuthenticated() {
    return Boolean(this.user);
  }

  getUser() {
    return this.user;
  }

  setUser(user: AuthUser | null) {
    this.user = user;

    if (!isBrowser) {
      return;
    }

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  logout() {
    this.setUser(null);
  }
}

export const authStore = new AuthStore();

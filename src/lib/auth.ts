
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language } from "./i18n";

// Define user roles
export type UserRole = 'student' | 'parent' | 'tutor' | 'admin' | 'service';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  language: Language;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      language: 'en',
      login: (user) => {
        console.log('Logging in user:', user);
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'math-tutor-auth',
    }
  )
);

// Helper function to check if user has a specific role
export const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

// Mock user data for demo purposes (to be replaced with real authentication)
// Using proper UUID format for compatibility with database
export const mockUsers: Record<string, User> = {
  student1: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Alice Student',
    email: 'alice@example.com',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Student&background=4267ac&color=fff',
  },
  parent1: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Bob Parent',
    email: 'bob@example.com',
    role: 'parent',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Parent&background=7e57c2&color=fff',
  },
  parent2: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Maria Responsável',
    email: 'maria@example.com',
    role: 'parent',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Responsável&background=7e57c2&color=fff',
  },
  tutor1: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Carol Tutor',
    email: 'carol@example.com',
    role: 'tutor',
    avatar: 'https://ui-avatars.com/api/?name=Carol+Tutor&background=00bcd4&color=fff',
  },
  admin1: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'David Admin',
    email: 'david@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=David+Admin&background=ff5722&color=fff',
  },
  service1: {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Eve Service',
    email: 'eve@example.com',
    role: 'service',
    avatar: 'https://ui-avatars.com/api/?name=Eve+Service&background=009688&color=fff',
  },
};

// Helper function to resolve mock user by key or return full user object
export const resolveUser = (userOrKey: User | string): User | null => {
  if (!userOrKey) return null;
  
  // If it's already a User object with proper UUID, return it
  if (typeof userOrKey === 'object' && userOrKey.id && userOrKey.id.includes('-')) {
    console.log('User already resolved with UUID:', userOrKey.id);
    return userOrKey;
  }
  
  // If it's a mock key, resolve to the actual user object
  if (typeof userOrKey === 'string') {
    const resolvedUser = mockUsers[userOrKey];
    if (resolvedUser) {
      console.log('Resolved mock key', userOrKey, 'to UUID:', resolvedUser.id);
      return resolvedUser;
    }
  }
  
  console.error('Could not resolve user:', userOrKey);
  return null;
};

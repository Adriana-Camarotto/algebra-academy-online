
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  language: 'en' | 'pt';
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: 'en' | 'pt') => void;
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      language: 'en',
      login: (user) => set({ user, isAuthenticated: true }),
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
export const mockUsers: Record<string, User> = {
  student1: {
    id: 'student1',
    name: 'Alice Student',
    email: 'alice@example.com',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Student&background=4267ac&color=fff',
  },
  parent1: {
    id: 'parent1',
    name: 'Bob Parent',
    email: 'bob@example.com',
    role: 'parent',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Parent&background=7e57c2&color=fff',
  },
  tutor1: {
    id: 'tutor1',
    name: 'Carol Tutor',
    email: 'carol@example.com',
    role: 'tutor',
    avatar: 'https://ui-avatars.com/api/?name=Carol+Tutor&background=00bcd4&color=fff',
  },
  admin1: {
    id: 'admin1',
    name: 'David Admin',
    email: 'david@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=David+Admin&background=ff5722&color=fff',
  },
  service1: {
    id: 'service1',
    name: 'Eve Service',
    email: 'eve@example.com',
    role: 'service',
    avatar: 'https://ui-avatars.com/api/?name=Eve+Service&background=009688&color=fff',
  },
};

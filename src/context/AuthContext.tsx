'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { authService } from '@/lib/services/authService';
import { userService } from '@/lib/services/userService';
import { UserRole } from '@/types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: { role: { name: string } }[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapRoleName(backendRole: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    'ADMIN': 'admin',
    'NRI': 'nri',
    'RELATIONSHIP_MANAGER': 'rm',
    'AGENT': 'agent',
    'LAWYER': 'lawyer',
    'CHARTERED_ACCOUNTANT': 'ca',
  };
  return roleMap[backendRole] || 'nri';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const userRole: UserRole = user?.roles?.[0]?.role?.name
    ? mapRoleName(user.roles[0].role.name)
    : 'nri';

  // Try to restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const me = await userService.getMe();
          setUser(me);
        } catch {
          apiClient.clearTokens();
        }
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    const me = await userService.getMe();
    setUser(me);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; role: string; phone?: string }) => {
    await authService.register(data);
    const me = await userService.getMe();
    setUser(me);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, userRole, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

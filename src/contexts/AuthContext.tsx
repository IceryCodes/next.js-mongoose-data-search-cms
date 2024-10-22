import React, { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { UserProps } from '@/domains/user';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserProps | null;
  login: (token: string, user: UserProps) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user'); // Store user data in session storage if necessary
    if (token) {
      setIsAuthenticated(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user'); // Remove user data from session storage
    setIsAuthenticated(false);
    setUser(null);
    router.refresh();
  };

  const login = (token: string, user: UserProps) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user)); // Store user data in session storage
    setIsAuthenticated(true);
    setUser(user);
    router.refresh();
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

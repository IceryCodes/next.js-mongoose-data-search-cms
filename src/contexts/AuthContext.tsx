import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from 'react';

import { UserProps } from '@/domains/user';
import { renewToken, TokenProps, verifyToken } from '@/utils/token';

interface LoginProps {
  token: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProps | null;
  login: ({ token }: LoginProps) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user'); // Remove user data from session storage
    setIsAuthenticated(false);
    setToken(null);
  }, []);

  const login = useCallback(async ({ token }: LoginProps) => {
    sessionStorage.setItem('token', token);
    const { user: userData }: TokenProps = await verifyToken(token);
    setIsAuthenticated(true);
    setToken(token);
    setUser(userData);
  }, []);

  useEffect(() => {
    const init = async () => {
      const tokenData: string | null = sessionStorage.getItem('token');

      if (tokenData) {
        try {
          // Check if the token is valid
          const { user: userData }: TokenProps = await verifyToken(tokenData);
          if (userData._id) {
            setIsAuthenticated(true);
            setToken(tokenData);
            setUser(userData);
          } else {
            const newToken: string | null = await renewToken(tokenData);
            if (newToken) {
              const { user: userData }: TokenProps = await verifyToken(newToken);
              setIsAuthenticated(true);
              setToken(newToken);
              setUser(userData);
            } else {
              logout();
            }
          }
        } catch {
          console.warn('Token renewing...');
          const newToken: string | null = await renewToken(tokenData);
          if (newToken) {
            const { user: userData }: TokenProps = await verifyToken(newToken);
            setIsAuthenticated(true);
            setToken(newToken);
            setUser(userData);
          } else {
            logout();
          }
        }
      }
    };

    init();
  }, [logout]);

  return <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

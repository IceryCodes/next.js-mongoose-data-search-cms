import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { UserProps } from '@/domains/user';
import { renewToken, TokenProps, verifyToken } from '@/utils/token';

interface LoginProps {
  token: string;
  user: UserProps;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProps | null;
  login: ({ token, user }: LoginProps) => void;
  logout: () => void;
  setUser: (user: UserProps) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user'); // Remove user data from session storage
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    ({ token, user }: LoginProps) => {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user)); // Store user data in session storage
      setIsAuthenticated(true);
      setToken(token);
      setUser(user);
      router.push(process.env.NEXT_PUBLIC_BASE_URL);
    },
    [router]
  );

  useEffect(() => {
    const init = async () => {
      const tokenData: string | null = sessionStorage.getItem('token');
      const userData: string | null = sessionStorage.getItem('user');

      if (tokenData) {
        try {
          // Check if the token is valid
          const { _id }: TokenProps = await verifyToken(tokenData);
          if (_id && userData) {
            setIsAuthenticated(true);
            setToken(tokenData);
            setUser(JSON.parse(userData));
          } else {
            const newToken: string | null = await renewToken(tokenData);
            if (newToken && userData) {
              setIsAuthenticated(true);
              setToken(newToken);
              setUser(JSON.parse(userData));
            } else {
              logout();
            }
          }
        } catch {
          console.warn('Token renewing...');
          const newToken: string | null = await renewToken(tokenData);
          if (newToken && userData) {
            setIsAuthenticated(true);
            setToken(newToken);
            setUser(JSON.parse(userData));
          } else {
            logout();
          }
        }
      }
    };

    init();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, setUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

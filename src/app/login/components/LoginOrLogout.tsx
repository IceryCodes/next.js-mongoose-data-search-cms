'use client';

import Login from '@/app/components/Auth/Login';
import Logout from '@/app/components/Auth/Logout';
import { useAuth } from '@/contexts/AuthContext';

const LoginOrLogout = () => {
  const { isAuthenticated } = useAuth();
  return <>{isAuthenticated ? <Logout /> : <Login />}</>;
};
export default LoginOrLogout;

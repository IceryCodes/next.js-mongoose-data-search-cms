'use client';

import Logout from '@/app/components/Auth/Logout';
import Login from '@/app/login/components/Login';
import { useAuth } from '@/contexts/AuthContext';

const LoginOrLogout = () => {
  const { isAuthenticated } = useAuth();
  return <>{isAuthenticated ? <Logout /> : <Login />}</>;
};
export default LoginOrLogout;

import { ReactElement, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { UserRoleType } from '@/domains/interfaces';
import { TokenProps, verifyToken } from '@/utils/token';

interface AdminProtectedProps {
  children: ReactElement;
}

const AdminProtected = ({ children }: AdminProtectedProps): ReactElement => {
  const { isAuthenticated } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const token: string | null = sessionStorage.getItem('token');

        if (token) {
          try {
            const decode: TokenProps = await verifyToken(token);

            if (isAuthenticated && typeof decode._id === 'string' && decode.role === UserRoleType.Admin) {
              setHasAccess(true);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }
      }
    };
    init();
  }, [isAuthenticated]);

  if (!hasAccess) return <></>;

  return <>{children}</>;
};

export default AdminProtected;

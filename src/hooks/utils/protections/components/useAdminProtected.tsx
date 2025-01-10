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
        const token: string | null = localStorage.getItem('token');

        if (token) {
          try {
            const { user }: TokenProps = await verifyToken(token);

            if (isAuthenticated && typeof user._id === 'string' && user.role === UserRoleType.Admin) {
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

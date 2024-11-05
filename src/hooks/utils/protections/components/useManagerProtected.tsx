import { ReactElement, useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { HospitalProps } from '@/domains/hospital';
import { UserRoleType } from '@/domains/interfaces';
import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { TokenProps, verifyToken } from '@/utils/token';

interface AdminProtectedProps {
  children: ReactElement;
  pageId: string;
  type: ManageCategoryType;
}

const ManagerProtected = ({ children, pageId, type }: AdminProtectedProps): ReactElement => {
  const { isAuthenticated } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  const isMatch = useCallback(
    (items: (HospitalProps | PharmacyProps)[]): boolean => items.some((obj) => obj._id.toString() === pageId),
    [pageId]
  );

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined') {
        const token: string | null = sessionStorage.getItem('token');

        if (token) {
          try {
            const {
              user,
              manage: { hospital, clinic, pharmacy },
            }: TokenProps = await verifyToken(token);

            if (isAuthenticated && typeof user._id === 'string' && user.role === UserRoleType.Admin) {
              setHasAccess(true);
              return;
            }

            const usedItems: (HospitalProps | PharmacyProps)[] =
              type === ManageCategoryType.Hospital ? hospital : type === ManageCategoryType.Clinic ? clinic : pharmacy;
            setHasAccess(isMatch(usedItems));
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }
      }
    };
    init();
  }, [isAuthenticated, isMatch, type]);

  if (!hasAccess) return <></>;

  return <>{children}</>;
};

export default ManagerProtected;

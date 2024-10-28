import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { getPageUrlByType, PageType, UserRoleType } from '@/domains/interfaces';

const useAdminProtected = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || user?.role !== UserRoleType.Admin) {
    logout();
    router.push(getPageUrlByType(PageType.LOGIN));
  }
};

export default useAdminProtected;

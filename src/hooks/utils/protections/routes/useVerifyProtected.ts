import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { getPageUrlByType, PageType } from '@/domains/interfaces';

const useVerifyProtected = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user?.isVerified) {
    logout();
    router.push(getPageUrlByType(PageType.LOGIN));
  }
};

export default useVerifyProtected;

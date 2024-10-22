import { useRouter } from 'next/router';

import { useAuth } from '@/contexts/AuthContext';
import { getPageUrlByType, PageType } from '@/domains/interfaces';

const useProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) router.push(`${getPageUrlByType(PageType.LOGIN)}`);
};

export default useProtectedRoute;

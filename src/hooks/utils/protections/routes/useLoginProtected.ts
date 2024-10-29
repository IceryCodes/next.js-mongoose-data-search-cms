import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { getPageUrlByType, PageType } from '@/domains/interfaces';

const useLoginProtected = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) router.push(getPageUrlByType(PageType.LOGIN));
};

export default useLoginProtected;

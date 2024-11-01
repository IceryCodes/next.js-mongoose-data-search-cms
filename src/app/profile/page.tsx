import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';

import ProfileContent from './components/ProfileContent';

export const generateMetadata = async (): Promise<Metadata> => {
  return metadataInfo({
    pageName: PageType.PROFILE,
    currentPath: `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.PROFILE)}`,
  });
};

const Page = (): ReactElement => (
  <div className={`mt-52 md:mt-0 md:h-content flex items-center`}>
    <ProfileContent />
  </div>
);
export default Page;

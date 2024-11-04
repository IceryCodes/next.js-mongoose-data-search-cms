import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';

import AdminContent from './components/AdminContent';

export const generateMetadata = async (): Promise<Metadata> => {
  return metadataInfo({
    pageName: PageType.PROFILE,
    currentPath: `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.PROFILE)}`,
  });
};

const Page = (): ReactElement => (
  <div className="container mx-auto p-6">
    <AdminContent />
  </div>
);
export default Page;

import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';

import HomeContent from './components/HomeContent';

export const generateMetadata = async (): Promise<Metadata> => {
  return metadataInfo({
    pageName: PageType.HOME,
    currentPath: `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.HOME)}`,
  });
};

const Page = (): ReactElement => <HomeContent />;
export default Page;

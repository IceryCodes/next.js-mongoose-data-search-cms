import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';

import VerifyContent from './components/VerifyContent';

export const generateMetadata = async (): Promise<Metadata> => {
  return metadataInfo({
    pageName: PageType.VERIFY,
    currentPath: `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.VERIFY)}`,
  });
};

const Page = (): ReactElement => (
  <div className={`mt-52 md:mt-0 md:h-content flex items-center justify-center`}>
    <VerifyContent />
  </div>
);

export default Page;

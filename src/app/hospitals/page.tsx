import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';

import HospitalList from './components/HospitalList';

export const generateMetadata = async (): Promise<Metadata> => {
  return metadataInfo({
    pageName: PageType.HOSPITALS,
    currentPath: `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.HOSPITALS)}`,
  });
};

const Page = (): ReactElement => <HospitalList />;

export default Page;

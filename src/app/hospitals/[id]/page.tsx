import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { getHospital } from '@/services/hospital';
import { GetHospitalReturnType } from '@/services/interfaces';

import HospitalContent from './components/HospitalContent';

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  const { id } = params;

  let _id: string = '';
  let title: string = '';
  const { hospital }: GetHospitalReturnType = await getHospital({ _id: id });
  if (hospital) {
    _id = hospital._id.toString();
    title = hospital.title;
  }

  const currentPath: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${getPageUrlByType(PageType.HOSPITALS)}/${_id}`;
  const pageName: string = title;

  return {
    title: `${pageName} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: '介紹',
    authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME, url: currentPath }],
    publisher: process.env.NEXT_PUBLIC_SITE_NAME,
    creator: process.env.NEXT_PUBLIC_SITE_NAME,
    generator: process.env.NEXT_PUBLIC_SITE_NAME,
    applicationName: process.env.NEXT_PUBLIC_SITE_NAME,
    keywords: [process.env.NEXT_PUBLIC_SITE_NAME, pageName, ...hospital!.keywords!],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
    openGraph: {
      type: 'website',
      title: process.env.NEXT_PUBLIC_SITE_NAME,
      description: 'pageExcerpt',
      emails: ['sales@mtmtech.com.tw'],
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: {
        url: process.env.NEXT_PUBLIC_FEATURED_IMAGE,
        secureUrl: process.env.NEXT_PUBLIC_FEATURED_IMAGE,
        alt: process.env.NEXT_PUBLIC_SITE_NAME,
        type: 'image/png',
        width: 1920,
        height: 1080,
      },
      url: currentPath,
    },
  };
};

const Page = (): ReactElement => <HospitalContent />;

export default Page;

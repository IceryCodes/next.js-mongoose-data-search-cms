import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/app/components/interface';
import { getPharmacy } from '@/services/pharmacy';

import { PharmacyProps } from '../interfaces';

import PharmacyContent from './components/PharmacyContent';

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  const { id } = params;

  let _id: string = '';
  let title: string = '';
  const pharmacy: PharmacyProps | null = await getPharmacy({ _id: id });
  if (pharmacy) {
    _id = pharmacy._id.toString();
    title = pharmacy.title;
  }
  const currentPath: string = `${process.env.NEXT_PRIVATE_BASE_URL}/${getPageUrlByType(PageType.PHARMACIES)}/${_id}`;
  const pageName: string = title;

  return {
    title: `${pageName} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: '介紹',
    authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME, url: currentPath }],
    publisher: process.env.NEXT_PUBLIC_SITE_NAME,
    creator: process.env.NEXT_PUBLIC_SITE_NAME,
    generator: process.env.NEXT_PUBLIC_SITE_NAME,
    applicationName: process.env.NEXT_PUBLIC_SITE_NAME,
    keywords: [process.env.NEXT_PUBLIC_SITE_NAME, pageName],
    metadataBase: new URL(process.env.NEXT_PRIVATE_BASE_URL),
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

const Page = (): ReactElement => <PharmacyContent />;

export default Page;
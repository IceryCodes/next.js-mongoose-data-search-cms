import { ReactElement } from 'react';

import { Metadata } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';
import { PharmacyProps } from '@/domains/pharmacy';
import { GetPharmacyReturnType } from '@/services/interfaces';
import { getPharmacy } from '@/services/pharmacy';

import PharmacyContent from './components/PharmacyContent';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const { id } = await params;

  let _id = '';
  let pageName = '';
  const { pharmacy }: GetPharmacyReturnType = await getPharmacy({ _id: id });
  if (pharmacy) {
    _id = pharmacy._id.toString();
    pageName = pharmacy.title;
  }

  const currentPath = `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.PHARMACIES)}/${_id}`;

  return metadataInfo({
    pageName,
    currentPath,
    description: pharmacy?.excerpt,
    keywords: pharmacy?.keywords,
    email: pharmacy?.email,
    featuredImage: pharmacy?.featuredImg,
    data: pharmacy as PharmacyProps,
  });
};

const Page = (): ReactElement => <PharmacyContent />;

export default Page;

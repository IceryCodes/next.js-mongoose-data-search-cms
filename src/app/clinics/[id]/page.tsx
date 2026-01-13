import { ReactElement } from 'react';

import { Metadata } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { metadataInfo } from '@/domains/metadatas';
import { getHospital } from '@/services/hospital';
import { GetHospitalReturnType } from '@/services/interfaces';

import ClinicContent from './components/ClinicContent';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const { id } = await params;

  let _id = '';
  let pageName = '';
  const { hospital }: GetHospitalReturnType = await getHospital({ _id: id });
  if (hospital) {
    _id = hospital._id.toString();
    pageName = hospital.title;
  }

  const currentPath = `${process.env.NEXT_PUBLIC_BASE_URL}${getPageUrlByType(PageType.HOSPITALS)}/${_id}`;

  return metadataInfo({
    pageName,
    currentPath,
    description: hospital?.excerpt,
    keywords: hospital?.keywords,
    email: hospital?.email,
    featuredImage: hospital?.featuredImg,
    data: hospital as HospitalProps,
  });
};

const Page = (): ReactElement => <ClinicContent />;

export default Page;

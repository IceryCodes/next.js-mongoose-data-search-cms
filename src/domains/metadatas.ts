import { HospitalProps } from './hospital';
import { getPageUrlByType, PageType } from './interfaces';
import { PharmacyProps } from './pharmacy';

interface GetDescriptionProps {
  currentPath: string;
  data?: HospitalProps | PharmacyProps;
}

interface MetadataInfoProps {
  pageName: string;
  currentPath: string;
  description?: string;
  keywords?: string[];
  email?: string;
  featuredImage?: string;
  data?: HospitalProps | PharmacyProps;
}

export const defaultHospitalExcerpt = ({ title, departments, county, district, address, phone }: HospitalProps): string =>
  `${title}是一間提供${departments.join(', ')}的醫院! 位於${county}${district}${address}，電話是${phone}!`;

export const defaultClicnicExcerpt = ({ title, departments, county, district, address, phone }: HospitalProps): string =>
  `${title}是一間提供${departments.join(', ')}的診所! 位於${county}${district}${address}，電話是${phone}!`;

export const defaultPharmacyExcerpt = ({
  title,
  county,
  district,
  address,
  healthInsuranceAuthorized,
  owner,
  phone,
}: PharmacyProps): string =>
  `${title}是一間位於${county}${district}${address}的藥局! ${healthInsuranceAuthorized ? '是健保特約的藥局，' : ''}${owner && `負責人為${owner}，`}電話是${phone}!`;

export const getDescription = ({ currentPath, data }: GetDescriptionProps): string => {
  switch (true) {
    case currentPath.includes(getPageUrlByType(PageType.HOME)):
      return '';
    case currentPath.includes(`${getPageUrlByType(PageType.HOSPITALS)}/`):
      return defaultHospitalExcerpt(data as HospitalProps);
    case currentPath.includes(getPageUrlByType(PageType.HOSPITALS)):
      return '';
    case currentPath.includes(`${getPageUrlByType(PageType.CLINICS)}/`):
      return defaultHospitalExcerpt(data as HospitalProps);
    case currentPath.includes(getPageUrlByType(PageType.CLINICS)):
      return '';
    case currentPath.includes(`${getPageUrlByType(PageType.PHARMACIES)}/`):
      return defaultPharmacyExcerpt(data as PharmacyProps);
    case currentPath.includes(getPageUrlByType(PageType.PHARMACIES)):
      return 'b';
    // case currentPath.includes(getPageUrlByType(PageType.REGISTER)):
    //   return '';
    case currentPath.includes(getPageUrlByType(PageType.LOGIN)):
      return '';
    case currentPath.includes(getPageUrlByType(PageType.VERIFY)):
      return '';
    case currentPath.includes(getPageUrlByType(PageType.PROFILE)):
      return '';
    default:
      return '';
  }
};

export const metadataInfo = ({
  pageName,
  currentPath,
  description = '',
  keywords = [],
  email = '',
  featuredImage = '',
  data,
}: MetadataInfoProps) => {
  const pagedescription: string = description || getDescription({ currentPath, data });

  return {
    title: `${pageName} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: pagedescription,
    authors: [{ name: pageName, url: currentPath }],
    publisher: process.env.NEXT_PUBLIC_SITE_NAME,
    creator: process.env.NEXT_PUBLIC_SITE_NAME,
    generator: process.env.NEXT_PUBLIC_SITE_NAME,
    applicationName: process.env.NEXT_PUBLIC_SITE_NAME,
    keywords: [process.env.NEXT_PUBLIC_SITE_NAME, pageName, ...keywords],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
    openGraph: {
      type: 'website',
      title: process.env.NEXT_PUBLIC_SITE_NAME,
      description: pagedescription,
      emails: [email, process.env.NEXT_PRIVATE_ADMIN_EMAIL],
      siteName: process.env.NEXT_PUBLIC_SITE_NAME,
      images: {
        url: new URL(featuredImage || `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEATURED_IMAGE}`),
        secureUrl: new URL(featuredImage || `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEATURED_IMAGE}`),
        alt: process.env.NEXT_PUBLIC_SITE_NAME,
        type: 'image/png',
        width: 1920,
        height: 1080,
      },
      url: currentPath,
    },
  };
};

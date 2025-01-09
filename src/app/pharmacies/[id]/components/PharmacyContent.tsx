'use client';
import { ReactElement, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';

import DeletePharmacyContent from '@/app/global-components/admin/DeletePharmacyContent';
import ManagePharmacyContent from '@/app/global-components/admin/ManagePharmacyContent';
import ManageRegisterButton from '@/app/global-components/admin/ManageRegisterButton';
import Breadcrumb from '@/app/global-components/Breadcrumb';
import Card from '@/app/global-components/Card';
import GoogleMapComponent from '@/app/global-components/GoogleMapComponent';
import GoogleOpening from '@/app/global-components/GoogleOpeningHours';
import GooglePhotoCarousel from '@/app/global-components/GooglePhotoCarousel';
import GoogleReviews from '@/app/global-components/GoogleReviews';
import Tab from '@/app/global-components/tabs/Tab';
import Tag from '@/app/global-components/tags/Tag';
import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { ManageCategoryType } from '@/domains/manage';
import { defaultPharmacyExcerpt } from '@/domains/metadatas';
import { useGoogleInfosMutation } from '@/features/google/hooks/useGoogleInfosMutation';
import { usePharmacyQuery } from '@/features/pharmacies/hooks/usePharmacyQuery';
import AdminProtected from '@/hooks/utils/protections/components/useAdminProtected';
import ManagerProtected from '@/hooks/utils/protections/components/useManagerProtected';
import ConvertLink, { LinkType } from '@/utils/links';

import BasicInfos from './BasicInfos';
import SidebarLayout from './SidebarLayout';

const PharmacyContent = (): ReactElement => {
  const params = useParams();
  const paramsId: string = params?.id as string;
  const router = useRouter();

  const { data: { pharmacy, manage } = {}, isLoading, isError, refetch } = usePharmacyQuery({ _id: paramsId });

  const { data: googleInfo, mutateAsync: fetchGoogleInfo } = useGoogleInfosMutation();

  const [isAddressChecked, setIsAddressChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAndFetchGoogleData = async () => {
      if (isLoading || isError || !pharmacy) return;

      const googleTitle = pharmacy.googleTitle;
      const googleAddress = `${pharmacy.county}${pharmacy.district}${pharmacy.address}`;

      const fetchBasedOn = (query: string) => fetchGoogleInfo({ title: query });

      if (!isAddressChecked && googleTitle) {
        const { formatted_address } = await fetchBasedOn(googleTitle);

        if (!formatted_address?.includes('號')) await fetchBasedOn(googleAddress);
        setIsAddressChecked(true);
      }
    };

    checkAndFetchGoogleData();
  }, [isLoading, isError, pharmacy, isAddressChecked, fetchGoogleInfo]);

  useEffect(() => {
    if (!isLoading && !pharmacy && !isError) {
      notFound();
    }
  }, [isLoading, pharmacy, isError, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500 text-lg">載入中...</span>
        </div>
      </div>
    );
  }

  if (isError) return <span>搜尋時發生錯誤</span>;
  if (!pharmacy) return <span>沒有符合藥局</span>;

  const {
    _id,
    // partner,
    orgCode,
    owner,
    gender,
    title,
    email,
    phone,
    county,
    district,
    address,
    doctors,
    excerpt,
    content,
    websiteUrl,
    featuredImg,
    healthInsuranceAuthorized,
    lineId,
  } = pharmacy;

  const {
    business_status,
    formatted_address,
    formatted_phone_number,
    international_phone_number,
    opening_hours,
    website,
    rating,
    user_ratings_total,
    icon,
    icon_background_color,
    name,
    reviews,
    photos,
  } = googleInfo || {};

  const usedExcerpt: string = excerpt ? excerpt : defaultPharmacyExcerpt(pharmacy);

  return (
    <div className="container mx-auto p-6">
      <div className="relative w-full">
        <SidebarLayout pageId={_id} county={county}>
          <div className="flex flex-col gap-y-6">
            <Image
              src={featuredImg ? featuredImg : process.env.NEXT_PUBLIC_FEATURED_IMAGE}
              alt={title}
              width={720}
              height={480}
              className="rounded-xl w-auto h-auto"
              priority={true}
            />
            <Breadcrumb pageName={title} />

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <ManagerProtected pageId={_id.toString()} type={ManageCategoryType.Pharmacy}>
                <ManagePharmacyContent pharmacy={pharmacy} refetch={refetch} />
              </ManagerProtected>
              <AdminProtected>
                <DeletePharmacyContent
                  _id={_id}
                  title={title}
                  afterDelete={() => router.push(getPageUrlByType(PageType.PHARMACIES))}
                />
              </AdminProtected>
              <div className="flex items-center">
                {icon && (
                  <div className="flex items-center justify-center mr-4" style={{ backgroundColor: icon_background_color }}>
                    <Image src={icon} alt={`${name}圖標`} width={40} height={40} />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold">{title}</h1>
                  {!!user_ratings_total && name && (
                    <span className="text-sm text-gray-600">
                      Google資料來源: {ConvertLink({ text: name, type: LinkType.GoogleMapSearch })}
                    </span>
                  )}
                </div>
              </div>
              {/* {partner && <Tag text="合作夥伴" />} */}
              {healthInsuranceAuthorized && <Tag text="健保特約藥局" />}
              {lineId && (
                <Link href={`https://line.me/R/ti/p/${lineId}`} target="_blank">
                  <h3 className="bg-[#00C338] text-sm px-2 py-1 text-white text-center w-[120px] rounded">加入Line</h3>
                </Link>
              )}
            </div>

            <Card>
              <>
                <blockquote className="border-l-4 pl-4 italic text-gray-600">{usedExcerpt}</blockquote>

                <AdminProtected>
                  <>
                    {!manage && _id && title && (
                      <span>
                        點擊圖示申請管理權限
                        <ManageRegisterButton _id={_id} title={title} />
                      </span>
                    )}
                  </>
                </AdminProtected>
              </>
            </Card>

            <Tab
              tabs={[
                {
                  title: '基本資料',
                  content: (
                    <BasicInfos
                      rating={rating}
                      user_ratings_total={user_ratings_total}
                      business_status={business_status}
                      owner={owner}
                      gender={gender}
                      orgCode={orgCode}
                      fullAddress={`${county}${district}${address}`}
                      formatted_address={formatted_address}
                      websiteUrl={websiteUrl}
                      website={website}
                      email={email}
                      phone={phone}
                      international_phone_number={international_phone_number}
                      formatted_phone_number={formatted_phone_number}
                    />
                  ),
                },
                !opening_hours
                  ? undefined
                  : {
                      title: '營業時間',
                      content: <GoogleOpening opening_hours={opening_hours} />,
                    },
              ]}
            />

            <Card>
              <>
                <h2 className="text-xl font-bold">關於{title}</h2>
                <p>{content ? content : `尚無關於${title}的相關資訊，歡迎藥局提供補充!`}</p>
              </>
            </Card>

            <Card>
              <>
                <h3 className="text-xl font-bold">藥局醫生: {doctors && doctors.join(', ')}</h3>
                <ul className="list-disc ml-5 grid grid-cols-1 md:grid-cols-3"></ul>
              </>
            </Card>

            <Card>
              <GoogleMapComponent locationData={[pharmacy]} />
            </Card>

            {photos && <GooglePhotoCarousel title={title} photos={photos} />}

            {reviews && <GoogleReviews reviews={reviews} />}
          </div>
        </SidebarLayout>
      </div>
    </div>
  );
};

export default PharmacyContent;

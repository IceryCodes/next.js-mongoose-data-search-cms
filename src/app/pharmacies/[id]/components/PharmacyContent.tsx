'use client';
import { ReactElement, useCallback, useEffect } from 'react';

import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';

import DeletePharmacyContent from '@/app/global-components/admin/DeletePharmacyContent';
import ManagePharmacyContent from '@/app/global-components/admin/ManagePharmacyContent';
import Breadcrumb from '@/app/global-components/Breadcrumb';
import Card from '@/app/global-components/Card';
import GoogleMapComponent from '@/app/global-components/GoogleMapComponent';
import Tag from '@/app/global-components/tags/Tag';
import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { ManageCategoryType } from '@/domains/manage';
import { defaultPharmacyExcerpt } from '@/domains/metadatas';
import { PharmacyProps } from '@/domains/pharmacy';
import { usePharmacyQuery } from '@/features/pharmacies/hooks/usePharmacyQuery';
import ManagerProtected from '@/hooks/utils/protections/components/useManagerProtected';
import { useEnum } from '@/hooks/utils/useEnum';
import ConvertLink, { LinkType } from '@/utils/links';

import SidebarLayout from './SidebarLayout';

const PharmacyContent = (): ReactElement => {
  const params = useParams();
  const paramsId: string = params?.id as string;
  const router = useRouter();

  const { composeGender } = useEnum();
  const { data, isLoading, isError, refetch } = usePharmacyQuery({ _id: paramsId });
  const pharmacy: PharmacyProps | null | undefined = data?.pharmacy;

  const mainInfoRender = useCallback(
    ({ label, value }: { label: string; value: ReactElement | null }): ReactElement => (
      <>
        {!!value && (
          <li>
            <h3>
              {label}: {value}
            </h3>
          </li>
        )}
      </>
    ),
    []
  );

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
    partner,
    orgCode,
    owner,
    gender,
    title,
    email,
    phone,
    county,
    district,
    doctors,
    address,
    excerpt,
    content,
    websiteUrl,
    featuredImg,
    healthInsuranceAuthorized,
  } = pharmacy;
  const usedExcerpt: string = excerpt ? excerpt : defaultPharmacyExcerpt(pharmacy);

  return (
    <div className="container mx-auto p-6">
      <div className="relative w-full">
        <SidebarLayout county={county}>
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
                <>
                  <ManagePharmacyContent pharmacy={pharmacy} refetch={refetch} />
                  <DeletePharmacyContent
                    _id={_id}
                    title={title}
                    afterDelete={() => router.push(getPageUrlByType(PageType.PHARMACIES))}
                  />
                </>
              </ManagerProtected>
              <h1 className="text-4xl font-bold">{title}</h1>
              {partner && <Tag text="先豐科技合作夥伴" />}
              {healthInsuranceAuthorized && <Tag text="健保特約藥局" />}
            </div>

            <Card>
              <>
                <blockquote className="border-l-4 pl-4 italic text-gray-600">{usedExcerpt}</blockquote>
                <ul className="list-disc ml-5">
                  {owner &&
                    mainInfoRender({ label: '負責人', value: <span>{owner + (gender && composeGender(gender))}</span> })}
                  {orgCode && mainInfoRender({ label: '機構代碼', value: <span>{orgCode}</span> })}
                  {phone &&
                    mainInfoRender({
                      label: '聯絡電話',
                      value: ConvertLink({ text: phone, type: LinkType.Phone }),
                    })}
                  {email &&
                    mainInfoRender({
                      label: '聯絡信箱',
                      value: ConvertLink({ text: email, type: LinkType.Email }),
                    })}
                  {mainInfoRender({
                    label: '藥局地址',
                    value: ConvertLink({ text: `${county}${district}${address}`, type: LinkType.Address }),
                  })}
                  {websiteUrl &&
                    mainInfoRender({
                      label: '藥局網站',
                      value: ConvertLink({ text: websiteUrl, type: LinkType.Website }),
                    })}
                </ul>
              </>
            </Card>

            <Card>
              <>
                <h2 className="text-2xl font-bold">關於{title}</h2>
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
          </div>
        </SidebarLayout>
      </div>
    </div>
  );
};

export default PharmacyContent;

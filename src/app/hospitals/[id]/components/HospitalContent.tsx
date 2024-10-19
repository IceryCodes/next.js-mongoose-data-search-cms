'use client';
import { ReactElement, useCallback, useEffect } from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import Breadcrumb from '@/app/components/Breadcrumb';
import Card from '@/app/components/Card';
import GoogleMapComponent from '@/app/components/GoogleMapComponent';
import Tag from '@/app/components/tags/Tag';
import SidebarLayout from '@/app/hospitals/[id]/components/SidebarLayout';
import { useHospitalQuery } from '@/features/hospitals/hooks/useHospitalQuery';
import { useEnum } from '@/hooks/utils/useEnum';
import ConvertLink, { LinkType } from '@/utils/links';

const HospitalContent = (): ReactElement => {
  const params = useParams();
  const _id: string = params?.id as string;
  const router = useRouter();

  const { composeGender } = useEnum();
  const { data: hospital, isLoading, isError } = useHospitalQuery({ _id });

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

  const workerInfoRender = useCallback(
    ({ label, value }: { label: string; value: number }): ReactElement => (
      <>
        {!!value && (
          <li>
            <label>
              {label}: {value}位
            </label>
          </li>
        )}
      </>
    ),
    []
  );

  useEffect(() => {
    if (!isLoading && !hospital && !isError) {
      router.push('/404'); // Redirect to /404 if no hospital is found
    }
  }, [isLoading, hospital, isError, router]);

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
  if (!hospital) return <span>沒有符合醫院</span>;

  const {
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
    departments,
    address,
    excerpt,
    content,
    websiteUrl,
    featuredImg,
  } = hospital;

  const usedExcerpt: string = excerpt
    ? excerpt
    : `${title}是一間提供${departments.join(', ')}的醫院! 位於${county}${district}${address}，電話是${phone}!`;

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
              <h1 className="text-4xl font-bold">{title}</h1>
              {partner && <Tag text="先豐科技合作夥伴" />}
            </div>

            <Card>
              <>
                <blockquote className="border-l-4 pl-4 italic text-gray-600">{usedExcerpt}</blockquote>
                <ul className="list-disc ml-5">
                  {owner && mainInfoRender({ label: '負責人', value: <span>{owner + composeGender(gender)}</span> })}
                  {mainInfoRender({ label: '機構代碼', value: <span>{orgCode}</span> })}
                  {mainInfoRender({
                    label: '聯絡電話',
                    value: ConvertLink({ text: phone, type: LinkType.Phone }),
                  })}
                  {mainInfoRender({
                    label: '聯絡信箱',
                    value: ConvertLink({ text: email, type: LinkType.Email }),
                  })}
                  {mainInfoRender({
                    label: '醫院地址',
                    value: ConvertLink({ text: `${county}${district}${address}`, type: LinkType.Address }),
                  })}
                  {mainInfoRender({
                    label: '醫院網站',
                    value: ConvertLink({ text: websiteUrl, type: LinkType.Website }),
                  })}
                </ul>
              </>
            </Card>

            <Card>
              <>
                <h2 className="text-2xl font-bold">關於{title}</h2>
                <p>{content ? content : `尚無關於${title}的相關資訊，歡迎醫院提供補充!`}</p>
              </>
            </Card>

            <Card>
              <>
                <h3 className="text-xl font-bold">本院醫生: {doctors.join(', ')}</h3>
                <ul className="list-disc ml-5 grid grid-cols-1 md:grid-cols-3">
                  {workerInfoRender({ label: '語言治療師', value: hospital['語言治療師'] })}
                  {workerInfoRender({ label: '牙體技術師', value: hospital['牙體技術師'] })}
                  {workerInfoRender({ label: '聽力師', value: hospital['聽力師'] })}
                  {workerInfoRender({ label: '牙體技術士', value: hospital['牙體技術士'] })}
                  {workerInfoRender({ label: '驗光師', value: hospital['驗光師'] })}
                  {workerInfoRender({ label: '驗光生', value: hospital['驗光生'] })}
                  {workerInfoRender({ label: '醫師', value: hospital['醫師'] })}
                  {workerInfoRender({ label: '中醫師', value: hospital['中醫師'] })}
                  {workerInfoRender({ label: '牙醫師', value: hospital['牙醫師'] })}
                  {workerInfoRender({ label: '藥師', value: hospital['藥師'] })}
                  {workerInfoRender({ label: '藥劑生', value: hospital['藥劑生'] })}
                  {workerInfoRender({ label: '護理師', value: hospital['護理師'] })}
                  {workerInfoRender({ label: '護士', value: hospital['護士'] })}
                  {workerInfoRender({ label: '助產士', value: hospital['助產士'] })}
                  {workerInfoRender({ label: '助產師', value: hospital['助產師'] })}
                  {workerInfoRender({ label: '醫事檢驗師', value: hospital['醫事檢驗師'] })}
                  {workerInfoRender({ label: '醫事檢驗生', value: hospital['醫事檢驗生'] })}
                  {workerInfoRender({ label: '物理治療師', value: hospital['物理治療師'] })}
                  {workerInfoRender({ label: '職能治療師', value: hospital['職能治療師'] })}
                  {workerInfoRender({ label: '醫事放射師', value: hospital['醫事放射師'] })}
                  {workerInfoRender({ label: '醫事放射士', value: hospital['醫事放射士'] })}
                  {workerInfoRender({ label: '物理治療生', value: hospital['物理治療生'] })}
                  {workerInfoRender({ label: '職能治療生', value: hospital['職能治療生'] })}
                  {workerInfoRender({ label: '呼吸治療師', value: hospital['呼吸治療師'] })}
                  {workerInfoRender({ label: '諮商心理師', value: hospital['諮商心理師'] })}
                  {workerInfoRender({ label: '臨床心理師', value: hospital['臨床心理師'] })}
                  {workerInfoRender({ label: '營養師', value: hospital['營養師'] })}
                </ul>
              </>
            </Card>

            <Card>
              <GoogleMapComponent locationData={[hospital]} />
            </Card>
          </div>
        </SidebarLayout>
      </div>
    </div>
  );
};

export default HospitalContent;

import { ReactElement } from 'react';

import { ObjectId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';

import Tag from '@/app/global-components/tags/Tag';
import { DistrictType, getPageUrlByType, PageType } from '@/domains/interfaces';

interface PharmacyListItemCardHorizontalProps {
  _id: ObjectId;
  partner: boolean;
  image: string;
  title: string;
  county: string;
  district: DistrictType;
  address: string;
  healthInsuranceAuthorized: boolean;
}

const PharmacyListItemCardHorizontal = ({
  _id,
  partner,
  image,
  title,
  county,
  district,
  address,
  healthInsuranceAuthorized,
}: PharmacyListItemCardHorizontalProps): ReactElement => (
  <Link
    href={`${getPageUrlByType(PageType.CLINICS)}/${_id}`}
    target="_blank"
    className="relative flex flex-col md:flex-row gap-4 border rounded-lg p-4 shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-white overflow-hidden"
  >
    {/* 推薦標籤 */}
    {partner && (
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute -top-2 -right-5 bg-blue-500 text-white font-bold py-1 px-10 transform translate-x-2 translate-y-3 rotate-45">
          推
        </div>
      </div>
    )}

    {/* 圖片容器 - 固定為正方形 */}
    <div className="w-full md:w-24 h-24 relative flex-shrink-0">
      <Image
        src={image}
        alt={title}
        fill
        className="rounded-lg object-cover"
        sizes="(max-width: 768px) 100vw, 192px"
        priority={true}
      />
    </div>

    {/* 內容區 */}
    <div className="flex flex-col flex-grow gap-2">
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold">{title}</h2>
        {healthInsuranceAuthorized && <Tag text="健保特約藥局" />}
      </div>

      <p className="text-gray-600">{`${county}${district}${address}`}</p>
    </div>
  </Link>
);

export default PharmacyListItemCardHorizontal;

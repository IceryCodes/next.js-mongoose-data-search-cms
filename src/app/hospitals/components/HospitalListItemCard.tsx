import { ReactElement } from 'react';

import { ObjectId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';

import Tag from '@/app/components/tags/Tag';
import { DepartmentsType } from '@/domains/hospital';
import { DistrictType, getPageUrlByType, PageType } from '@/domains/interfaces';

interface HospitalListItemCardProps {
  _id: ObjectId;
  partner: boolean;
  image: string;
  title: string;
  county: string;
  district: DistrictType;
  address: string;
  departments: DepartmentsType[];
}

const HospitalListItemCard = ({
  _id,
  partner,
  image,
  title,
  county,
  district,
  address,
  departments,
}: HospitalListItemCardProps): ReactElement => (
  <Link
    href={`${getPageUrlByType(PageType.HOSPITALS)}/${_id}`}
    className="flex flex-col gap-1 border rounded p-4 shadow-lg hover:scale-105 transition-transform duration-300 bg-white"
  >
    <Image src={image} alt="Hospital Image" width={720} height={480} className="rounded" priority={true} />
    <div className="flex flex-col items-start">
      <span className="text-xl font-bold">{title}</span>
      {partner && <Tag text="先豐科技合作夥伴" />}
    </div>
    <p>{`${county}${district}${address}`}</p>
    <div className="flex flex-wrap gap-2 mt-2">
      {departments.map((department: DepartmentsType) => (
        <Tag key={department} text={department} />
      ))}
    </div>
  </Link>
);

export default HospitalListItemCard;

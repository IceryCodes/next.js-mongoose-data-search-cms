import { ReactElement } from 'react';

import GoogleBusinessStatusTag from '@/app/global-components/tags/GoogleBusinessStatusTag';
import { GoogleBusinessStatus } from '@/domains/google';
import { GenderType } from '@/domains/interfaces';
import { useEnum } from '@/hooks/utils/useEnum';
import { liContentRender } from '@/utils/liContentRender';
import ConvertLink, { LinkType } from '@/utils/links';

interface BasicInfosProps {
  rating: number | undefined;
  user_ratings_total: number | undefined;
  business_status: GoogleBusinessStatus | undefined;
  owner: string | undefined;
  gender: GenderType | undefined;
  orgCode: string;
  fullAddress: string;
  formatted_address: string | undefined;
  websiteUrl: string | undefined;
  website: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  international_phone_number: string | undefined;
  formatted_phone_number: string | undefined;
}

const BasicInfos = ({
  rating,
  user_ratings_total,
  business_status,
  owner,
  gender,
  orgCode,
  fullAddress,
  formatted_address,
  websiteUrl,
  website,
  email,
  phone,
  international_phone_number,
  formatted_phone_number,
}: BasicInfosProps): ReactElement => {
  const { composeGender } = useEnum();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">基本資料</h3>
      <ul className="space-y-6">
        {/* Google Rating */}
        {!!user_ratings_total &&
          liContentRender({
            label: 'Google評分',
            value: (
              <span className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(Number(rating)) ? 'text-yellow-500' : 'text-gray-300'}>
                    &#9733; {/* Star symbol */}
                  </span>
                ))}
                {` (${user_ratings_total}則評論)`}
              </span>
            ),
          })}

        {/* Business Status */}
        {!!business_status &&
          liContentRender({
            label: '營業狀態',
            value: <span className="text-gray-700 font-medium">{GoogleBusinessStatusTag({ status: business_status })}</span>,
          })}

        {/* Owner & Gender */}
        {!!owner &&
          liContentRender({
            label: '負責人員',
            value: <span className="text-gray-700">{owner + (gender && composeGender(gender))}</span>,
          })}

        {/* Organization Code */}
        {!!orgCode &&
          liContentRender({
            label: '機構代碼',
            value: <span className="text-gray-700">{orgCode}</span>,
          })}

        {/* Address */}
        {!!(fullAddress || formatted_address) &&
          liContentRender({
            label: '藥局地址',
            value: ConvertLink({ text: fullAddress ?? formatted_address, type: LinkType.Address }),
          })}

        {/* Website Links */}
        {!!(websiteUrl || website) &&
          liContentRender({
            label: '藥局網站',
            value: (
              <div className="flex flex-col gap-2">
                <span className="text-blue-600 hover:underline">
                  {websiteUrl
                    ? ConvertLink({ text: websiteUrl, type: LinkType.Website })
                    : website && ConvertLink({ text: website, type: LinkType.Website })}
                </span>
              </div>
            ),
          })}

        {/* Email */}
        {!!email &&
          liContentRender({
            label: '聯絡信箱',
            value: (
              <span className="text-blue-600 hover:underline">{ConvertLink({ text: email, type: LinkType.Email })}</span>
            ),
          })}

        {/* Contact Phone */}
        {!!(phone || international_phone_number || formatted_phone_number) &&
          liContentRender({
            label: '聯絡電話',
            value: (
              <div className="flex flex-col gap-2">
                {phone ? (
                  <span className="text-blue-600 hover:underline">{ConvertLink({ text: phone, type: LinkType.Phone })}</span>
                ) : international_phone_number ? (
                  <span className="text-blue-600 hover:underline">
                    {ConvertLink({ text: international_phone_number, type: LinkType.Phone })}
                  </span>
                ) : (
                  formatted_phone_number && (
                    <span className="text-blue-600 hover:underline">
                      {ConvertLink({ text: formatted_phone_number, type: LinkType.Phone })}
                    </span>
                  )
                )}
              </div>
            ),
          })}
      </ul>
    </div>
  );
};

export default BasicInfos;

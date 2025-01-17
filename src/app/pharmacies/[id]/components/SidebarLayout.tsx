import { ReactElement, useCallback } from 'react';

import { ObjectId } from 'mongodb';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { Button, ButtonStyleType } from '@/app/global-components/buttons/Button';
import Card from '@/app/global-components/Card';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
import { Select } from '@/app/global-components/selects/Select';
import PharmacyListItemCard from '@/app/pharmacies/components/PharmacyListItemCard';
import { CountyType, getPageUrlByType, PageType } from '@/domains/interfaces';
import { GetPharmaciesDto, PharmacyProps } from '@/domains/pharmacy';
import { usePharmaciesQuery } from '@/features/pharmacies/hooks/usePharmaciesQuery';

interface SidebarLayoutProps {
  pageId: ObjectId;
  county: string;
  children: ReactElement;
}

const limit: number = 6;

const SidebarLayout = ({ pageId, county, children }: SidebarLayoutProps) => {
  const router = useRouter();
  const { control, handleSubmit, getValues, reset } = useForm<GetPharmaciesDto>({
    defaultValues: {
      query: '',
      county,
      partner: false,
      healthInsuranceAuthorized: false,
    },
  });

  const {
    data: { pharmacies = [] } = {},
    isLoading,
    isError,
    refetch,
  } = usePharmaciesQuery({
    query: getValues('query'),
    county: getValues('county'),
    partner: getValues('partner'),
    healthInsuranceAuthorized: getValues('healthInsuranceAuthorized'),
    limit,
  });

  const onSubmit = useCallback(
    (formData: GetPharmaciesDto) => {
      refetch();
      reset(formData);
    },
    [refetch, reset]
  );

  return (
    <div className="flex gap-x-8">
      <div className="w-full md:w-2/3">{children}</div>
      <div className="w-1/3 flex-col hidden md:flex">
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <>
              <label className="text-xl font-bold">附近藥局</label>
              {/* search form */}
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex gap-x-2">
                  <Button
                    text="返回列表"
                    buttonStyle={ButtonStyleType.Disabled}
                    onClick={() => router.push(getPageUrlByType(PageType.PHARMACIES))}
                    className="rounded w-2/3"
                  />
                  <Button text="搜尋" type="submit" className="w-1/3" />
                </div>

                <Controller
                  name="partner"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center">
                      <Input type={InputStyleType.Checkbox} checked={value} onChange={(e) => onChange(e.target.checked)} />
                      <label className="text-sm">{`${process.env.NEXT_PUBLIC_SITE_NAME}合作夥伴`}</label>
                    </div>
                  )}
                />

                <Controller
                  name="healthInsuranceAuthorized"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center">
                      <Input type={InputStyleType.Checkbox} checked={value} onChange={(e) => onChange(e.target.checked)} />
                      <label className="text-sm">健保特約藥局</label>
                    </div>
                  )}
                />

                <Controller
                  name="query"
                  control={control}
                  render={({ field }) => <Input placeholder="藥局名稱" {...field} />}
                />

                <Controller
                  name="county"
                  control={control}
                  render={({ field }) => <Select {...field} defaultValue="所有縣市" options={Object.values(CountyType)} />}
                />
              </form>
            </>
          </Card>
        )}

        <div className="relative w-full">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
              <span className="text-gray-500 text-lg">搜尋中...</span>
            </div>
          )}
          {isError && <span>搜尋附近藥局出現錯誤</span>}

          {/* Pharmacy list */}
          <div className="grid grid-cols-1 gap-4 p-4">
            {!pharmacies.length && <label>附近沒有符合藥局</label>}
            {pharmacies
              .filter(({ _id }: PharmacyProps) => _id !== pageId)
              .map(
                ({
                  _id,
                  title,
                  partner,
                  county,
                  district,
                  address,
                  healthInsuranceAuthorized,
                  featuredImg,
                }: PharmacyProps) => (
                  <PharmacyListItemCard
                    key={_id.toString()}
                    _id={_id}
                    image={featuredImg ? featuredImg : process.env.NEXT_PUBLIC_FEATURED_IMAGE}
                    title={title}
                    county={county}
                    district={district}
                    address={address}
                    healthInsuranceAuthorized={healthInsuranceAuthorized}
                    partner={partner}
                  />
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;

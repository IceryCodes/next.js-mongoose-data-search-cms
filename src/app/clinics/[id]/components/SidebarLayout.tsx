import { ReactElement, useCallback } from 'react';

import { ObjectId } from 'mongodb';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import ClinicListItemCard from '@/app/clinics/components/ClinicListItemCard';
import { Button, ButtonStyleType } from '@/app/global-components/buttons/Button';
import Card from '@/app/global-components/Card';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
import { Select } from '@/app/global-components/selects/Select';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { CountyType, getPageUrlByType, PageType } from '@/domains/interfaces';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';

interface SidebarLayoutProps {
  pageId: ObjectId;
  county: string;
  children: ReactElement;
}

const limit: number = 6;

const SidebarLayout = ({ pageId, county, children }: SidebarLayoutProps) => {
  const router = useRouter();
  const { control, handleSubmit, getValues, reset } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county,
      departments: '' as DepartmentsType,
      partner: false,
    },
  });

  const {
    data: { hospitals = [] } = {},
    isLoading,
    isError,
    refetch,
  } = useHospitalsQuery({
    query: getValues('query'),
    county: getValues('county'),
    departments: getValues('departments') as DepartmentsType,
    keywords: [],
    partner: getValues('partner'),
    category: HospitalCategoryType.Clinic,
    limit,
  });

  const onSubmit = useCallback(
    (formData: GetHospitalsDto) => {
      refetch();
      reset(formData);
    },
    [refetch, reset]
  );

  return (
    <div className="flex gap-x-8">
      <div className=" w-full md:w-2/3">{children}</div>
      <div className="w-1/3 flex-col hidden md:flex">
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <>
              <label className="text-xl font-bold">附近診所</label>
              {/* search form */}
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex gap-x-2">
                  <Button
                    text="返回列表"
                    buttonStyle={ButtonStyleType.Disabled}
                    onClick={() => router.push(getPageUrlByType(PageType.HOSPITALS))}
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
                  name="query"
                  control={control}
                  render={({ field }) => <Input placeholder="診所名稱" {...field} />}
                />

                <Controller
                  name="county"
                  control={control}
                  render={({ field }) => <Select {...field} defaultValue="所有縣市" options={Object.values(CountyType)} />}
                />

                <Controller
                  name="departments"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} defaultValue="所有科別" options={Object.values(DepartmentsType)} />
                  )}
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
          {isError && <span>搜尋附近診所出現錯誤</span>}

          {/* Hospital list */}
          <div className="grid grid-cols-1 gap-4 p-4">
            {!hospitals.length && <label>附近沒有符合診所</label>}
            {hospitals
              .filter(({ _id }: HospitalProps) => _id !== pageId)
              .map(({ _id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
                <ClinicListItemCard
                  key={_id.toString()}
                  _id={_id}
                  image={featuredImg ? featuredImg : process.env.NEXT_PUBLIC_FEATURED_IMAGE}
                  title={title}
                  county={county}
                  district={district}
                  address={address}
                  departments={departments}
                  partner={partner}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;

'use client';
import { ChangeEvent, ReactElement, useCallback, useState } from 'react';

import { Controller, FieldValues, useForm, UseFormSetValue } from 'react-hook-form';

import CreateHospitalContent from '@/app/global-components/admin/CreateHospitalContent';
import { Button } from '@/app/global-components/buttons/Button';
import GoogleMapComponent from '@/app/global-components/GoogleMapComponent';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
import Pagination from '@/app/global-components/Pagination';
import { Select } from '@/app/global-components/selects/Select';
import { TagGroup } from '@/app/global-components/tags/TagGroup';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { CountyType, PageType } from '@/domains/interfaces';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';
import AdminProtected from '@/hooks/utils/protections/components/useAdminProtected';

import ClinicListItemCard from './ClinicListItemCard';

const limit: number = 12;

const ClinicList = (): ReactElement => {
  const { control, handleSubmit, getValues, reset, setValue } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      keywords: [],
      partner: false,
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: { hospitals = [], total = 0 } = {},
    isLoading,
    isError,
    refetch,
  } = useHospitalsQuery({
    query: getValues('query'),
    county: getValues('county'),
    departments: getValues('departments') as DepartmentsType,
    keywords: getValues('keywords'),
    partner: getValues('partner'),
    category: HospitalCategoryType.Clinic,
    page: currentPage,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const onSubmit = useCallback(
    (formData: GetHospitalsDto) => {
      refetch();
      reset(formData);
      setCurrentPage(1);
    },
    [refetch, reset]
  );

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{PageType.CLINICS}</h1>
        <AdminProtected>
          <CreateHospitalContent />
        </AdminProtected>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-4/5">
          <Controller name="query" control={control} render={({ field }) => <Input placeholder="診所名稱" {...field} />} />

          <Controller
            name="county"
            control={control}
            render={({ field }) => <Select {...field} defaultValue="所有縣市" options={Object.values(CountyType)} />}
          />

          <Controller
            name="departments"
            control={control}
            render={({ field }) => <Select {...field} defaultValue="所有科別" options={Object.values(DepartmentsType)} />}
          />

          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  value={Array.isArray(field.value) ? field.value.join(',') : ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    field.onChange(event.target.value ? event.target.value.split(',') : [])
                  }
                  placeholder="關鍵字 (多個用半形逗號分隔)"
                />
                <TagGroup
                  tags={field.value}
                  fieldName="keywords"
                  setValue={setValue as unknown as UseFormSetValue<FieldValues>}
                />
              </>
            )}
          />

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
        </div>

        <div className="w-1/5">
          <Button text="搜尋" type="submit" className="w-full" />
        </div>
      </form>

      <GoogleMapComponent locationData={hospitals} />

      {/* Loading overlay */}
      <div className="relative w-full min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
            <span className="text-gray-500 text-lg">搜尋中...</span>
          </div>
        )}
        {isError && <span>搜尋時發生錯誤</span>}

        {/* Hospital list */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!hospitals.length && <label>沒有符合診所</label>}
          {hospitals.map(({ _id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
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
        </section>

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default ClinicList;

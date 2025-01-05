'use client';
import { ReactElement, useCallback, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import CreateHospitalContent from '@/app/global-components/admin/CreateHospitalContent';
import { Button } from '@/app/global-components/buttons/Button';
import GoogleMapComponent from '@/app/global-components/GoogleMapComponent';
import { Input } from '@/app/global-components/inputs/Input';
import KeywordSelector from '@/app/global-components/keywords/KeywordSelector';
import Pagination from '@/app/global-components/Pagination';
import { Select } from '@/app/global-components/selects/Select';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps, keywordOptions } from '@/domains/hospital';
import { CountyType, PageType } from '@/domains/interfaces';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';
import AdminProtected from '@/hooks/utils/protections/components/useAdminProtected';

import HospitalListItemCardHorizontal from './HospitalListItemCardHorizontal';

const limit: number = 12;

const HospitalList = (): ReactElement => {
  const { control, handleSubmit, reset } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      keywords: [],
      partner: false,
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useState({
    query: '',
    county: '',
    departments: '' as DepartmentsType,
    keywords: [] as string[],
    partner: false,
    category: HospitalCategoryType.Hospital,
    page: currentPage,
    limit,
  });

  const { data: { hospitals = [], total = 0 } = {}, isLoading, isError } = useHospitalsQuery(searchParams);

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const onSubmit = useCallback(
    (formData: GetHospitalsDto) => {
      setSearchParams({
        ...formData,
        category: HospitalCategoryType.Hospital,
        page: 1,
        limit,
      });
      reset(formData);
      setCurrentPage(1);
    },
    [reset]
  );

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{PageType.HOSPITALS}</h1>
        <AdminProtected>
          <CreateHospitalContent />
        </AdminProtected>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
          <Controller name="query" control={control} render={({ field }) => <Input placeholder="文字搜尋" {...field} />} />

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

          <label className="text-sm text-gray-500">睡眠相關關鍵字:</label>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <KeywordSelector
                keywords={keywordOptions}
                selectedKeywords={field.value}
                onKeywordsChange={field.onChange}
                className="col-span-2 md:col-span-3"
              />
            )}
          />
        </div>

        <div className="w-full md:w-1/6">
          <Button text="搜尋" type="submit" className="w-full" />
        </div>
      </form>

      <GoogleMapComponent locationData={hospitals} />

      <div className="relative w-full min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
            <span className="text-gray-500 text-lg">搜尋中...</span>
          </div>
        )}
        {isError && <span>搜尋時發生錯誤</span>}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!hospitals.length && <label>沒有符合醫院</label>}
          {hospitals.map(({ _id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
            <HospitalListItemCardHorizontal
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

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default HospitalList;

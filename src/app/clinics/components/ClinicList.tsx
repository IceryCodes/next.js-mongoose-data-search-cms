'use client';
import { ReactElement, useCallback, useState } from 'react';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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

import ClinicListItemCardHorizontal from './ClinicListItemCardHorizontal';

const limit: number = 12;

const ClinicList = (): ReactElement => {
  const keywordsParams = useSearchParams();
  const keywords: string[] | undefined = keywordsParams ? keywordsParams.get('keywords')?.split(',') : undefined;

  const { control, handleSubmit, reset, getValues } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      keywords: keywords ?? [],
      partner: false,
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(!!keywords);
  const [searchParams, setSearchParams] = useState({
    query: '',
    county: '',
    departments: '' as DepartmentsType,
    keywords: keywords ?? [],
    partner: false,
    category: HospitalCategoryType.Clinic,
    page: currentPage,
    limit,
  });

  const {
    data: { hospitals = [], total = 0 } = {},
    isLoading,
    isError,
  } = useHospitalsQuery({
    ...searchParams,
    enabled: hasSearched,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({ ...prev, page }));
  }, []);

  const onSubmit = useCallback(
    (formData: GetHospitalsDto) => {
      setSearchParams({
        ...formData,
        category: HospitalCategoryType.Clinic,
        page: 1,
        limit,
      });
      setHasSearched(true);
      reset(formData);
      setCurrentPage(1);
    },
    [reset]
  );

  const handleKeywordChange = useCallback(
    (keywords: string[], field: { onChange: (value: string[]) => void }) => {
      field.onChange(keywords);
      // Get current form values and submit with new keywords
      const formData = getValues();
      onSubmit({ ...formData, keywords });
    },
    [getValues, onSubmit]
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
          <Controller name="query" control={control} render={({ field }) => <Input placeholder="輸入搜尋" {...field} />} />

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
                onKeywordsChange={(keywords: string[]) => handleKeywordChange(keywords, field)}
                className="col-span-2 md:col-span-3"
              />
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
        {!hasSearched ? (
          <div className="flex flex-col justify-center items-center h-[400px] gap-4">
            <Image
              src="/assets/search icon.svg"
              alt="search icon"
              width={200}
              height={200}
              className="max-h-[200px] w-auto md:max-h-[200px]"
              priority
            />
            <span className="text-gray-500">請輸入搜尋條件</span>
          </div>
        ) : isLoading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
            <span className="text-gray-500 text-lg">搜尋中...</span>
          </div>
        ) : isError ? (
          <span>搜尋時發生錯誤</span>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!hospitals.length && <label>沒有符合診所</label>}
              {hospitals.map(
                ({ _id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
                  <ClinicListItemCardHorizontal
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
                )
              )}
            </section>
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicList;

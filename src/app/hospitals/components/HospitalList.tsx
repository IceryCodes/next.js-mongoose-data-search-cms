'use client';
import { ReactElement, useCallback, useEffect, useState } from 'react';

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
import { useLocationQuery } from '@/features/google/hooks/useLocationQuery';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';
import AdminProtected from '@/hooks/utils/protections/components/useAdminProtected';

import HospitalListItemCardHorizontal from './HospitalListItemCardHorizontal';

const limit = 12;

const HospitalList = (): ReactElement => {
  const keywordsParams = useSearchParams();
  const keywords: string[] | undefined = keywordsParams ? keywordsParams.get('keywords')?.split(',') : undefined;
  const { data: userLocation = '', isLoading: locationLoading } = useLocationQuery({});

  const { control, handleSubmit, reset, getValues, setValue } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: userLocation,
      departments: '' as DepartmentsType,
      keywords: keywords ?? [],
      partner: false,
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(!!keywords);
  const [searchParams, setSearchParams] = useState({
    query: '',
    county: userLocation,
    departments: '' as DepartmentsType,
    keywords: keywords ?? [],
    partner: false,
    category: HospitalCategoryType.Hospital,
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
        category: HospitalCategoryType.Hospital,
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

  useEffect(() => {
    if (userLocation) {
      setValue('county', userLocation);
    }
  }, [setValue, userLocation]);

  if (locationLoading) return <div>載入中...</div>;

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

        <div className="w-full md:w-1/6">
          <Button text="搜尋" type="submit" className="w-full" />
        </div>
      </form>

      <GoogleMapComponent locationData={hospitals} />

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
              {!hospitals.length && <label>沒有符合醫院</label>}
              {hospitals.map(
                ({ _id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
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

export default HospitalList;

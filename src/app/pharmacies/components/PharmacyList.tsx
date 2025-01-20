'use client';
import { ReactElement, useCallback, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import CreatePharmacyContent from '@/app/global-components/admin/CreatePharmacyContent';
import { Button } from '@/app/global-components/buttons/Button';
import GoogleMapComponent from '@/app/global-components/GoogleMapComponent';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
import Pagination from '@/app/global-components/Pagination';
import { Select } from '@/app/global-components/selects/Select';
import { CountyType, PageType } from '@/domains/interfaces';
import { GetPharmaciesDto, PharmacyProps } from '@/domains/pharmacy';
import { usePharmaciesQuery } from '@/features/pharmacies/hooks/usePharmaciesQuery';
import AdminProtected from '@/hooks/utils/protections/components/useAdminProtected';

import PharmacyListItemCardHorizontal from './PharmacyListItemCardHorizontal';

const limit: number = 12;

const PharmacyList = (): ReactElement => {
  const { control, handleSubmit, getValues, reset } = useForm<GetPharmaciesDto>({
    defaultValues: {
      query: '',
      county: '',
      partner: false,
      healthInsuranceAuthorized: false,
    },
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const {
    data: { pharmacies = [], total = 0 } = {},
    isLoading,
    isError,
    refetch,
  } = usePharmaciesQuery({
    query: getValues('query'),
    county: getValues('county'),
    partner: getValues('partner'),
    healthInsuranceAuthorized: getValues('healthInsuranceAuthorized'),
    page: currentPage,
    limit,
    enabled: hasSearched,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const onSubmit = useCallback(
    (formData: GetPharmaciesDto) => {
      refetch();
      setHasSearched(true);
      reset(formData);
      setCurrentPage(1);
    },
    [refetch, reset]
  );

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{PageType.PHARMACIES}</h1>
        <AdminProtected>
          <CreatePharmacyContent />
        </AdminProtected>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-4/5">
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <input type="text" placeholder="藥局名稱" {...field} className="border rounded px-4 py-2 w-full" />
            )}
          />

          <Controller
            name="county"
            control={control}
            render={({ field }) => <Select {...field} defaultValue="所有縣市" options={Object.values(CountyType)} />}
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
        </div>

        <div className="w-1/5">
          <Button text="搜尋" type="submit" className="w-full" />
        </div>
      </form>

      <GoogleMapComponent locationData={pharmacies} />

      {/* Loading overlay */}
      <div className="relative w-full min-h-[400px]">
        {!hasSearched ? (
          <div className="flex flex-col justify-center items-center h-[400px] gap-4">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 relative">
                  <div className="absolute w-14 h-14 border-4 rounded-full border-blue-500"></div>
                  <div className="absolute w-6 h-6 bg-blue-500 rotate-45 bottom-1 right-1"></div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
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
              {!pharmacies.length && <label>沒有符合藥局</label>}
              {pharmacies.map(
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
                  <PharmacyListItemCardHorizontal
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
            </section>
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default PharmacyList;

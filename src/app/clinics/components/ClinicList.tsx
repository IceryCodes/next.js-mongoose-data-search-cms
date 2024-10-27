'use client';
import { ReactElement, useCallback, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/components/buttons/Button';
import GoogleMapComponent from '@/app/components/GoogleMapComponent';
import Pagination from '@/app/components/Pagination';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { CountyType, PageType } from '@/domains/interfaces';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';

import ClinicListItemCard from './ClinicListItemCard';

const limit: number = 12;

const ClinicList = (): ReactElement => {
  const { control, handleSubmit, getValues, reset } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
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
    partner: getValues('partner'),
    category: HospitalCategoryType.Clinic,
    page: currentPage,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const onSubmit = useCallback((formData: GetHospitalsDto) => {
    refetch();
    reset(formData);
    setCurrentPage(1);
  }, []);

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold">{PageType.CLINICS}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-4/5">
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <input type="text" placeholder="診所名稱" {...field} className="border rounded px-4 py-2 w-full" />
            )}
          />

          <Controller
            name="county"
            control={control}
            render={({ field }) => (
              <select {...field} className="border rounded px-4 py-2 w-full">
                <option value="">所有地區</option>
                {Object.values(CountyType).map((county: string) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            name="departments"
            control={control}
            render={({ field }) => (
              <select {...field} className="border rounded px-4 py-2 w-full">
                <option value="">所有科別</option>
                {Object.values(DepartmentsType).map((department: string) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            )}
          />

          <Controller
            name="partner"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value={value.toString()}
                  onChange={(e) => onChange(e.target.checked.toString())}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm">先豐科技合作夥伴</label>
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

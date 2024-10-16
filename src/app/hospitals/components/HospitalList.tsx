'use client';
import { ReactElement, useCallback, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/components/buttons/Button';
import GoogleMapComponent from '@/app/components/GoogleMapComponent';
import { PageType } from '@/app/components/interface';
import Pagination from '@/app/components/Pagination';
import { CountyType, DepartmentsType, HospitalProps } from '@/app/hospitals/interfaces';
import { HospitalsDto } from '@/domains/hospital';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';

import HospitalListItemCard from './HospitalListItemCard';

const limit: number = 12;

const HospitalList = (): ReactElement => {
  const { control, handleSubmit, getValues, reset } = useForm<HospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
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
    page: currentPage,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  const onPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const onSubmit = useCallback((formData: HospitalsDto) => {
    refetch();
    reset(formData);
    setCurrentPage(1);
  }, []);

  return (
    <div className="container mx-auto flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold">{PageType.HOSPITALS}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-4/5">
          <Controller
            name="query"
            control={control}
            render={({ field }) => (
              <input type="text" placeholder="醫院名稱" {...field} className="border rounded px-4 py-2 w-full" />
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
        </div>

        <div className="w-1/5">
          <Button text="搜尋" type="submit" className="w-full" />
        </div>
      </form>

      <GoogleMapComponent hospitals={hospitals} />

      {/* Loading overlay */}
      <div className="relative w-full">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
            <span className="text-gray-500 text-lg">搜尋中...</span>
          </div>
        )}
        {isError && <span>Error fetching hospitals</span>}

        {/* Hospital list */}
        <section className="min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!hospitals.length && <label>沒有符合醫院</label>}
            {hospitals.map(({ id, title, partner, county, district, address, featuredImg, departments }: HospitalProps) => (
              <HospitalListItemCard
                key={id}
                id={id}
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

          {/* Pagination */}
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </section>
      </div>
    </div>
  );
};

export default HospitalList;

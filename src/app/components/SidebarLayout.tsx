import { ReactElement, useCallback } from 'react';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { HospitalsDto } from '@/domains/hospital';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';

import HospitalListItemCard from '../hospitals/components/HospitalListItemCard';
import { CountyType, DepartmentsType, HospitalProps } from '../hospitals/interfaces';

import { Button, ButtonStyleType } from './buttons/Button';
import Card from './Card';
import { getPageUrlByType, PageType } from './interface';

interface SidebarLayoutProps {
  county: string;
  children: ReactElement;
}

const limit: number = 5;

const SidebarLayout = ({ county, children }: SidebarLayoutProps) => {
  const router = useRouter();
  const { control, handleSubmit, getValues, reset } = useForm<HospitalsDto>({
    defaultValues: {
      query: '',
      county,
      departments: '' as DepartmentsType,
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
    limit,
  });

  const onSubmit = useCallback((formData: HospitalsDto) => {
    refetch();
    reset(formData);
  }, []);

  return (
    <div className="flex gap-x-8">
      <div className=" w-full md:w-2/3">{children}</div>
      <div className="w-1/3 flex-col hidden md:flex">
        <Card>
          <>
            <label className="text-xl font-bold">附近醫院</label>
            {/* search form */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex gap-x-2">
                <Button
                  text="返回列表"
                  buttonStyle={ButtonStyleType.Gray}
                  onClick={() => router.push(`/${getPageUrlByType(PageType.HOSPITALS)}`)}
                  className="rounded w-2/3"
                />

                <Button text="搜尋" type="submit" className="w-1/3" />
              </div>

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
            </form>
          </>
        </Card>

        <div className="relative w-full">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70">
              <span className="text-gray-500 text-lg">搜尋中...</span>
            </div>
          )}
          {isError && <span>搜尋附近醫院出現錯誤</span>}

          {/* Hospital list */}
          <div className="grid grid-cols-1 gap-4 p-4">
            {!hospitals.length && <label>附近沒有符合醫院</label>}
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
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;

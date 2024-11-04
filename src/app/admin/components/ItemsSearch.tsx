import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/global-components/buttons/Button';
import { DepartmentsType, GetHospitalsDto } from '@/domains/hospital';
import { CountyType } from '@/domains/interfaces';

interface ItemsSearchProps {
  searchItems: (formData: GetHospitalsDto) => void;
}

const ItemsSearch = ({ searchItems }: ItemsSearchProps) => {
  const { control, handleSubmit, reset } = useForm<GetHospitalsDto>({
    defaultValues: {
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      partner: false,
    },
  });

  const onSubmit = useCallback(
    (formData: GetHospitalsDto) => {
      searchItems(formData);
      reset(formData);
    },
    [reset, searchItems]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 mb-4 w-full">
      <div className="flex flex-row-reverse justify-between gap-x-4">
        <Button text="搜尋" type="submit" className="col-span-1" />

        <Controller
          name="partner"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="flex items-center col-span-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="text-sm">先豐科技合作夥伴</label>
            </div>
          )}
        />
      </div>

      <Controller
        name="query"
        control={control}
        render={({ field }) => (
          <input type="text" placeholder="醫院名稱" {...field} className="border rounded px-4 py-2 w-full" />
        )}
      />

      <div className="flex justify-between gap-x-4">
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
    </form>
  );
};

export default ItemsSearch;

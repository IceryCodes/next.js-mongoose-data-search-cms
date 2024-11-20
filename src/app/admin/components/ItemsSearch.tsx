import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/global-components/buttons/Button';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
import { Select } from '@/app/global-components/selects/Select';
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
              <Input type={InputStyleType.Checkbox} checked={value} onChange={(e) => onChange(e.target.checked)} />
              <label className="text-sm">{`${process.env.NEXT_PUBLIC_SITE_NAME}合作夥伴`}</label>
            </div>
          )}
        />
      </div>

      <Controller name="query" control={control} render={({ field }) => <Input placeholder="醫院名稱" {...field} />} />

      <div className="flex justify-between gap-x-4">
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
      </div>
    </form>
  );
};

export default ItemsSearch;

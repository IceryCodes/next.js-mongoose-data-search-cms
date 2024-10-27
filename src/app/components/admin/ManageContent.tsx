'use client';

import { ReactElement, useCallback, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { HospitalProps, HospitalUpdateDto } from '@/domains/hospital';
import { CountyType, districtOptions, DistrictType } from '@/domains/interfaces';
import { useEnum } from '@/hooks/utils/useEnum';
import { hospitalValidationSchema } from '@/lib/validation';

import { Button } from '../buttons/Button';
import Popup from '../Popup';

interface ManageHospitalContentProps {
  hospital: HospitalProps;
}

const ManageHospitalContent = ({ hospital }: ManageHospitalContentProps) => {
  const { hospitalExtraFieldMap } = useEnum();
  const [display, setDisplay] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<HospitalUpdateDto>({
    resolver: yupResolver(hospitalValidationSchema),
    defaultValues: hospital,
  });

  // Watch the `county` field for changes
  const county = watch('county');

  const onSubmit = useCallback(
    (data: HospitalUpdateDto) => {
      console.log('Form data:', data);
      reset(data);
    },
    [reset]
  );

  const form = useMemo(
    (): ReactElement => (
      <Popup title="編輯醫院" display={display} onClose={() => setDisplay(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4 w-[500px]">
          <div className="flex justify-end col-span-6">
            <Button type="submit" text="提交" disabled={!isDirty} />
          </div>

          <div className="flex flex-col col-span-3">
            <label>縣市</label>
            <Controller
              name="county"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <select {...field} className="border rounded px-4 py-2 w-full">
                    <option value="">所有地區</option>
                    {Object.values(CountyType).map((county: string) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-3">
            <label>區域</label>
            <Controller
              name="district"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <select {...field} className="border rounded px-4 py-2 w-full">
                    <option value="">所有地區</option>
                    {Object.values(districtOptions[county] ?? {}).map((district: DistrictType) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-3">
            <label>標題</label>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    {...field}
                    placeholder="醫療機構的標題"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-3">
            <label>地址</label>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    {...field}
                    placeholder="完整地址"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-3">
            <label>關鍵字</label>
            <Controller
              name="keywords"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    {...field}
                    placeholder="關鍵字 (多個用逗號分隔)"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-3">
            <label>特色圖片網址</label>
            <Controller
              name="featuredImg"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="url"
                    {...field}
                    placeholder="https://example.com/image.jpg"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-6">
            <label>摘錄</label>
            <Controller
              name="excerpt"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    {...field}
                    placeholder="醫療機構的摘錄"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className="flex flex-col col-span-6">
            <label>內容</label>
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <textarea
                    className="w-full h-40 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    {...field}
                    placeholder="醫療機構的詳細內容"
                  />
                  {error && <p className="text-red-500">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-span-6">
            <Button type="button" text="詳細內容" onClick={() => setExpand(!expand)} />
          </div>

          {expand &&
            Object.entries(hospitalExtraFieldMap).map(([label]) => (
              <div key={label} className="flex flex-col col-span-2">
                <label>{label}</label>
                <Controller
                  name={label as keyof HospitalUpdateDto}
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <input
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="number"
                        value={!isNaN(Number(value)) ? Number(value) : 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder={`輸入${label}人數`}
                      />
                      {error && <p className="text-red-500">{error.message}</p>}
                    </>
                  )}
                />
              </div>
            ))}
        </form>
      </Popup>
    ),
    [display, handleSubmit, onSubmit, isDirty, control, expand, hospitalExtraFieldMap, county]
  );

  return (
    <>
      <Button element={<label>123</label>} onClick={() => setDisplay(true)} />
      {form}
    </>
  );
};

export default ManageHospitalContent;

'use client';

import { ChangeEvent, ReactElement, useCallback, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { useToast } from '@/contexts/ToastContext';
import { DepartmentsType, HospitalProps, UpdateHospitalProps } from '@/domains/hospital';
import { CountyType, districtOptions, DistrictType, GenderType } from '@/domains/interfaces';
import { useUpdateHospitalMutation } from '@/features/hospitals/hooks/useUpdateHospitalMutation';
import { useEnum } from '@/hooks/utils/useEnum';
import { hospitalValidationSchema } from '@/lib/validation';

import { Button, defaultButtonStyle } from '../buttons/Button';
import FieldErrorlabel from '../FieldErrorlabel';
import Popup from '../Popup';

interface ManageHospitalContentProps {
  hospital: HospitalProps;
  refetch: () => void;
}

interface FormFieldProps {
  titleText: string;
  fieldName: keyof UpdateHospitalProps;
  placeholder: string;
  col: number;
  type?: string;
}

const inputStyle: string = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400';

const ManageHospitalContent = ({ hospital, refetch }: ManageHospitalContentProps) => {
  const { hospitalExtraFieldMap } = useEnum();
  const { isLoading, mutateAsync } = useUpdateHospitalMutation({ onSuccess: refetch });
  const { showToast } = useToast();

  const [display, setDisplay] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<UpdateHospitalProps>({
    resolver: yupResolver(hospitalValidationSchema),
    defaultValues: hospital,
  });

  const messageArray = useMemo((): string[] => {
    return Object.values(errors).flatMap((error) => (Array.isArray(error) ? error.map((e) => e.message) : [error.message]));
  }, [errors]);

  // Watch the `county` field for changes
  const county = watch('county');

  const formField = useCallback(
    ({ titleText, fieldName, placeholder, col, type = 'text' }: FormFieldProps): ReactElement => (
      <div className={`flex flex-col col-span-${col}`}>
        <label>{titleText}</label>
        <Controller
          name={fieldName}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                className={inputStyle}
                type={type}
                {...field}
                value={typeof field.value === 'string' || typeof field.value === 'number' ? field.value : ''}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={placeholder}
              />
              <FieldErrorlabel error={error} />
            </>
          )}
        />
      </div>
    ),
    [control]
  );

  const onSubmit = useCallback(
    async (data: UpdateHospitalProps) => {
      try {
        const result = await mutateAsync({
          _id: hospital._id,
          ...data,
          address: data.address.replaceAll(data.county, '').replaceAll(data.district, ''),
        });
        if (typeof result === 'string') throw new Error(result);

        const { message } = result;
        if (message) showToast({ message });

        reset(data);
      } catch (error) {
        console.error('Update error:', error);
      }
    },
    [hospital._id, mutateAsync, reset, showToast]
  );

  const form = useMemo(
    (): ReactElement => (
      <Popup title="編輯醫院" display={display} onClose={() => setDisplay(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4 w-[500px]">
          <div className="flex flex-col col-span-3 justify-center">
            {messageArray.length > 0 &&
              messageArray.map((message, index) => (
                <label key={index} className="text-red-500 text-[12px]">
                  {message}
                </label>
              ))}
            {isLoading && <label>更新中...</label>}
          </div>

          <div className="flex justify-end col-span-3 items-center">
            <Button type="submit" text="提交" disabled={!isDirty} />
          </div>

          {formField({
            titleText: '標題(含"醫院"則歸類為醫院)',
            fieldName: 'title',
            placeholder: '醫療機構',
            col: 6,
          })}

          <Controller
            name="partner"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center col-span-3">
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

          {formField({
            titleText: '機構代碼',
            fieldName: 'orgCode',
            placeholder: '機構代碼',
            col: 3,
          })}

          <div className="flex flex-col col-span-3">
            <label onClick={() => onSubmit}>縣市</label>
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
                  <FieldErrorlabel error={error} />
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
                  <FieldErrorlabel error={error} />
                </>
              )}
            />
          </div>

          {formField({
            titleText: '地址',
            fieldName: 'address',
            placeholder: '完整地址(無需包含縣市及地址)',
            col: 3,
          })}

          {formField({
            titleText: '電話',
            fieldName: 'phone',
            placeholder: '聯絡電話',
            col: 3,
            type: 'tel',
          })}

          {formField({
            titleText: '信箱',
            fieldName: 'email',
            placeholder: '聯絡信箱',
            col: 3,
            type: 'email',
          })}

          <div className="flex flex-col col-span-3">
            <label>關鍵字</label>
            <Controller
              name="keywords"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className={inputStyle}
                    type="text"
                    {...field}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      field.onChange(event.target.value ? event.target.value.split(',') : [])
                    }
                    placeholder="關鍵字 (多個用半形逗號分隔)"
                  />
                  <FieldErrorlabel error={error} />
                </>
              )}
            />
          </div>

          {formField({
            titleText: '負責人',
            fieldName: 'owner',
            placeholder: '負責人姓名',
            col: 3,
          })}

          <div className="flex flex-col col-span-3">
            <label>負責人性別</label>
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <div className="flex justify-around gap-x-2">
                    <Button
                      element={<span>男</span>}
                      onClick={() => field.onChange(GenderType.Male)}
                      className={`${defaultButtonStyle} w-full p-2 border rounded-md ${field.value === GenderType.Male ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'}`}
                    />
                    <Button
                      element={<span>女</span>}
                      onClick={() => field.onChange(GenderType.Female)}
                      className={`${defaultButtonStyle} w-full p-2 border rounded-md ${field.value === GenderType.Female ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'}`}
                    />
                  </div>
                  <FieldErrorlabel error={error} />
                </div>
              )}
            />
          </div>

          {formField({
            titleText: '網站網址',
            fieldName: 'websiteUrl',
            placeholder: process.env.NEXT_PUBLIC_BASE_URL,
            col: 3,
            type: 'url',
          })}

          {formField({
            titleText: '預覽圖網址',
            fieldName: 'featuredImg',
            placeholder: `${process.env.NEXT_PUBLIC_BASE_URL}/image.jpg`,
            col: 3,
            type: 'url',
          })}

          <div className="flex flex-col col-span-6">
            <label>科別</label>
            <Controller
              name="departments"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(DepartmentsType).map((department) => (
                    <label key={department} className="flex items-center">
                      <input
                        type="checkbox"
                        value={department}
                        checked={value?.includes(department)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const updatedDepartments = isChecked
                            ? [...(value || []), department]
                            : value?.filter((d) => d !== department) || [];
                          onChange(updatedDepartments);
                        }}
                        className="mr-2"
                      />
                      {department}
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col col-span-6">
            <label>醫院醫生</label>
            <Controller
              name="doctors"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    className={inputStyle}
                    type="text"
                    {...field}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      field.onChange(event.target.value ? event.target.value.split(',') : [])
                    }
                    placeholder="醫院醫生 (多個用半形逗號分隔)"
                  />
                  <FieldErrorlabel error={error} />
                </>
              )}
            />
          </div>

          {formField({
            titleText: '簡述',
            fieldName: 'excerpt',
            placeholder: '醫療機構的簡述',
            col: 6,
          })}
          <div className="flex flex-col col-span-6">
            <label>簡述</label>
            <Controller
              name="excerpt"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input className={inputStyle} type="text" {...field} placeholder="醫療機構的簡述" />
                  <FieldErrorlabel error={error} />
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
                  <textarea className={`${inputStyle} h-40`} {...field} placeholder="醫療機構的詳細內容" />
                  <FieldErrorlabel error={error} />
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
                  name={label as keyof UpdateHospitalProps}
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <input
                        className={inputStyle}
                        type="number"
                        value={!isNaN(Number(value)) ? Number(value) : 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder={`輸入${label}人數`}
                      />
                      <FieldErrorlabel error={error} />
                    </>
                  )}
                />
              </div>
            ))}
        </form>
      </Popup>
    ),
    [
      display,
      handleSubmit,
      onSubmit,
      messageArray,
      isLoading,
      isDirty,
      formField,
      control,
      expand,
      hospitalExtraFieldMap,
      county,
    ]
  );

  const onClick = () => setDisplay(true);

  return (
    <>
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-6 h-6 cursor-pointer text-gray-600 hover:text-blue-600 transition"
      >
        <path d="M3 17.25V21h3.75l11.39-11.39-3.75-3.75L3 17.25zM16 3l5 5-2 2-5-5 2-2z" />
      </svg>
      {form}
    </>
  );
};

export default ManageHospitalContent;

'use client';

import { ChangeEvent, ReactElement, useCallback, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { Button, defaultButtonStyle } from '@/app/global-components/buttons/Button';
import { useToast } from '@/contexts/ToastContext';
import { CountyType, districtOptions, DistrictType, GenderType } from '@/domains/interfaces';
import { UpdatePharmacyProps } from '@/domains/pharmacy';
import { useCreatePharmacyMutation } from '@/features/pharmacies/hooks/useCreatePharmacyMutation';
import { pharmacyValidationSchema } from '@/lib/validation';

import FieldErrorlabel from '../FieldErrorlabel';
import Popup from '../Popup';

interface FormFieldProps {
  titleText: string;
  fieldName: keyof UpdatePharmacyProps;
  placeholder: string;
  col: number;
  type?: string;
}

const defaultPharmacy: UpdatePharmacyProps = {
  partner: false,
  orgCode: '',
  owner: '',
  gender: GenderType.None,
  doctors: [],
  websiteUrl: '',
  email: '',
  phone: '',
  county: '' as CountyType,
  district: '',
  address: '',
  title: '',
  excerpt: '',
  content: '',
  keywords: [],
  featuredImg: '',
  healthInsuranceAuthorized: false,
};

const inputStyle: string = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400';

const CreatePharmacyContent = () => {
  const { isLoading, mutateAsync } = useCreatePharmacyMutation();
  const { showToast } = useToast();

  const [display, setDisplay] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<UpdatePharmacyProps>({
    resolver: yupResolver(pharmacyValidationSchema),
    defaultValues: defaultPharmacy,
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
    async (data: UpdatePharmacyProps) => {
      const confirmed = window.confirm(`您確定要新增${data.title}嗎?`);
      if (!confirmed) return;

      try {
        const result = await mutateAsync({
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
    [mutateAsync, reset, showToast]
  );

  const form = useMemo(
    (): ReactElement => (
      <Popup title="新增藥局" display={display} onClose={() => setDisplay(false)}>
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
            titleText: '標題',
            fieldName: 'title',
            placeholder: '藥局',
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
            <label>藥局醫生</label>
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
                    placeholder="藥局醫生 (多個用半形逗號分隔)"
                  />
                  <FieldErrorlabel error={error} />
                </>
              )}
            />
          </div>

          {formField({
            titleText: '簡述',
            fieldName: 'excerpt',
            placeholder: '藥局的簡述',
            col: 6,
          })}
          <div className="flex flex-col col-span-6">
            <label>簡述</label>
            <Controller
              name="excerpt"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input className={inputStyle} type="text" {...field} placeholder="藥局的簡述" />
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
                  <textarea className={`${inputStyle} h-40`} {...field} placeholder="藥局的詳細內容" />
                  <FieldErrorlabel error={error} />
                </>
              )}
            />
          </div>
        </form>
      </Popup>
    ),
    [display, handleSubmit, onSubmit, messageArray, isLoading, isDirty, formField, control, county]
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      {form}
    </>
  );
};

export default CreatePharmacyContent;

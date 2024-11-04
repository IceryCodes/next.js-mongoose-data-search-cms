'use client';

import { ReactElement, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { Button, defaultButtonStyle } from '@/app/global-components/buttons/Button';
import FieldErrorlabel from '@/app/global-components/FieldErrorlabel';
import { ToastStyleType } from '@/app/global-components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { GenderType } from '@/domains/interfaces';
import { UserRegisterDto } from '@/domains/user';
import { useUserRegisterMutation } from '@/features/user/hooks/useAuthMutation';
import { registerValidationSchema } from '@/lib/validation';

const RegisterContent = (): ReactElement => {
  const { login, logout } = useAuth();
  const { showToast } = useToast();

  const { control, handleSubmit, reset } = useForm<UserRegisterDto>({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: GenderType.None,
    },
  });
  const { isLoading, mutateAsync } = useUserRegisterMutation();

  const handleRegister = async (data: UserRegisterDto) => {
    try {
      const result = await mutateAsync(data);
      if (typeof result === 'string') throw new Error(result);

      const { token, user, message } = result;
      if (token && user) {
        login({ token, user });
        showToast({ message });
      } else {
        logout();
        if (message) showToast({ message, toastStyle: ToastStyleType.Warning });
      }

      reset();
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  useEffect(() => logout(), [logout]);

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="max-w-md min-w-96 mx-auto p-4 flex flex-col gap-y-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">註冊</h2>

      <div className="flex justify-around gap-x-2">
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                type="text"
                {...field}
                placeholder="名字"
                autoComplete="given-name"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FieldErrorlabel error={error} />
            </div>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                type="text"
                {...field}
                placeholder="姓氏"
                autoComplete="family-name"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FieldErrorlabel error={error} />
            </div>
          )}
        />
      </div>

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

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <input
              type="email"
              {...field}
              placeholder="信箱"
              autoComplete="email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FieldErrorlabel error={error} />
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <input
              type="password"
              {...field}
              placeholder="密碼"
              autoComplete="current-password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FieldErrorlabel error={error} />
          </div>
        )}
      />

      <Button text={isLoading ? '註冊中...' : '註冊'} type="submit" disabled={isLoading} className="w-full" />
    </form>
  );
};

export default RegisterContent;

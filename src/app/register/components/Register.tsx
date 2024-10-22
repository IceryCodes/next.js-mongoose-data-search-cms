'use client';

import React, { useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button, defaultButtonStyle } from '@/app/components/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
import { GenderType } from '@/domains/interfaces';
import { UserRegisterDto } from '@/domains/user';
import { useRegisterMutation } from '@/features/user/useAuthMutation';

const Register: React.FC = () => {
  const { login, logout } = useAuth();

  const { control, handleSubmit, reset } = useForm<UserRegisterDto>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      gender: GenderType.None,
    },
  });
  const { isLoading, mutateAsync } = useRegisterMutation();

  const handleRegister = async (data: UserRegisterDto) => {
    try {
      const result = await mutateAsync(data);
      if (typeof result === 'string') throw new Error(result);

      const { token, user } = result;
      if (token && user) {
        login(token, user);
      } else {
        logout();
      }

      reset();
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  useEffect(() => logout(), []);

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
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="名字"
              autoComplete="given-name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="姓氏"
              autoComplete="family-name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />
      </div>

      <div className="flex justify-around gap-x-2">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <>
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
            </>
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <input
            type="email"
            {...field}
            placeholder="信箱"
            autoComplete="email"
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <input
            type="password"
            {...field}
            placeholder="密碼"
            autoComplete="current-password"
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
      />

      <Button text={isLoading ? '註冊中...' : '註冊'} type="submit" disabled={isLoading} className="w-full" />
    </form>
  );
};

export default Register;

'use client';

import React, { useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/components/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
import { UserLoginDto } from '@/domains/user';
import { useLoginMutation } from '@/features/user/useAuthMutation';

const Login: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<UserLoginDto>({
    defaultValues: { email: '', password: '' },
  });
  const { isLoading, mutateAsync } = useLoginMutation();
  const { login, logout } = useAuth();

  const handleLogin = async (data: UserLoginDto) => {
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
      console.error('Login error:', error);
    }
  };

  useEffect(() => logout(), []);

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="max-w-md min-w-96 mx-auto p-4 flex flex-col gap-y-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">登入</h2>
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

      <Button text={isLoading ? '登入中...' : '登入'} type="submit" disabled={isLoading} className="w-full" />
    </form>
  );
};

export default Login;

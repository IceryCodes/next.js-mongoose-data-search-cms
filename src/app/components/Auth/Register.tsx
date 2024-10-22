'use client';

import React from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/components/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
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

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">註冊</h2>
      <div className="mb-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="First Name"
              autoComplete="given-name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              placeholder="Last Name"
              autoComplete="family-name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              type="email"
              {...field}
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              type="password"
              {...field}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        />
      </div>
      <Button text={isLoading ? '註冊中...' : '註冊'} type="submit" disabled={isLoading} className="w-full" />
    </form>
  );
};

export default Register;

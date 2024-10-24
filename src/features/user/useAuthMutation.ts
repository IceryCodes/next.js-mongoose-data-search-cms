import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { UserLoginDto, UserRegisterDto, UserResendVerificationDto } from '@/domains/user';
import { userLogin, userRegister, userResendVerification } from '@/services/auth';
import { UserLoginReturnType, UserResendVerificationReturnType } from '@/services/interfaces';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useRegisterMutation: UseMutationFn<UserLoginReturnType, UserRegisterDto> = (args) => {
  const { onError, onSuccess, mutationPrefixKey = [] } = args ?? {};
  const {
    isPending: isLoading,
    isError,
    error,
    data,
    mutate,
    mutateAsync,
  } = useMutation({
    mutationKey: [...mutationPrefixKey],
    mutationFn: userRegister,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

export const useLoginMutation: UseMutationFn<UserLoginReturnType, UserLoginDto> = (args) => {
  const { onError, onSuccess, mutationPrefixKey = [] } = args ?? {};
  const {
    isPending: isLoading,
    isError,
    error,
    data,
    mutate,
    mutateAsync,
  } = useMutation({
    mutationKey: [...mutationPrefixKey],
    mutationFn: userLogin,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

export const useResendVerificationMutation: UseMutationFn<UserResendVerificationReturnType, UserResendVerificationDto> = (
  args
) => {
  const { onError, onSuccess, mutationPrefixKey = [] } = args ?? {};
  const {
    isPending: isLoading,
    isError,
    error,
    data,
    mutate,
    mutateAsync,
  } = useMutation({
    mutationKey: [...mutationPrefixKey],
    mutationFn: userResendVerification,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

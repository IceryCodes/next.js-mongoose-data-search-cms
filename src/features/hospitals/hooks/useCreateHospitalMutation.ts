import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { CreateHospitalDto } from '@/domains/hospital';
import { createHospital } from '@/services/hospital';
import { HospitalUpdateReturnType } from '@/services/interfaces';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useCreateHospitalMutation: UseMutationFn<HospitalUpdateReturnType, CreateHospitalDto> = (args) => {
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
    mutationFn: createHospital,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

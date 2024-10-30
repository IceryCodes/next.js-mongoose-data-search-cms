import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { UpdateHospitalDto } from '@/domains/hospital';
import { updateHospital } from '@/services/hospital';
import { UpdateHospitalReturnType } from '@/services/interfaces';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useUpdateHospitalMutation: UseMutationFn<UpdateHospitalReturnType, UpdateHospitalDto> = (args) => {
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
    mutationFn: updateHospital,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

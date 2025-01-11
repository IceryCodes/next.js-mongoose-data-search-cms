import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { UpdateHospitalViewDto } from '@/domains/hospital';
import { updateHospitalView } from '@/services/hospital';
import { HospitalUpdateReturnType } from '@/services/interfaces';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useUpdateHospitalViewMutation: UseMutationFn<HospitalUpdateReturnType, UpdateHospitalViewDto> = (args) => {
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
    mutationFn: updateHospitalView,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

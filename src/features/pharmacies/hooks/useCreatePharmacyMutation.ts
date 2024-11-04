import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { CreatePharmacyDto } from '@/domains/pharmacy';
import { PharmacyUpdateReturnType } from '@/services/interfaces';
import { createPharmacy } from '@/services/pharmacy';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useCreatePharmacyMutation: UseMutationFn<PharmacyUpdateReturnType, CreatePharmacyDto> = (args) => {
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
    mutationFn: createPharmacy,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

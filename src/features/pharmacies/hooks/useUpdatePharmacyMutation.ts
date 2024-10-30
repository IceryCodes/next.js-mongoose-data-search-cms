import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { UpdatePharmacyDto } from '@/domains/pharmacy';
import { PharmacyUpdateReturnType } from '@/services/interfaces';
import { updatePharmacy } from '@/services/pharmacy';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useUpdatePharmacyMutation: UseMutationFn<PharmacyUpdateReturnType, UpdatePharmacyDto> = (args) => {
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
    mutationFn: updatePharmacy,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

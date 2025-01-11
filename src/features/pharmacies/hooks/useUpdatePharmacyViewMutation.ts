import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { UpdatePharmacyViewDto } from '@/domains/pharmacy';
import { PharmacyUpdateReturnType } from '@/services/interfaces';
import { updatePharmacyView } from '@/services/pharmacy';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useUpdatePharmacyViewMutation: UseMutationFn<PharmacyUpdateReturnType, UpdatePharmacyViewDto> = (args) => {
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
    mutationFn: updatePharmacyView,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

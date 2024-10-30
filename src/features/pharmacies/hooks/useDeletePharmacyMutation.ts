import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { DeletePharmacyDto } from '@/domains/pharmacy';
import { UpdatePharmacyReturnType } from '@/services/interfaces';
import { deletePharmacy } from '@/services/pharmacy';
import type { UseMutationFn } from '@/utils/reactQuery';

export const useDeletePharmacyMutation: UseMutationFn<UpdatePharmacyReturnType, DeletePharmacyDto> = (args) => {
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
    mutationFn: deletePharmacy,
    onSuccess,
    onError,
  });

  return useMemo(() => {
    return { isLoading, isError, error, data, mutate, mutateAsync };
  }, [isLoading, isError, error, data, mutate, mutateAsync]);
};

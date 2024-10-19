import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { PharmacyProps } from '@/app/pharmacies/interfaces';
import { PharmacyDto } from '@/domains/pharmacy';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { getPharmacy, pharmacyQueryKeys } from '@/services/pharmacy';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface UsePharmacyQueryProps extends QueryBaseProps<PharmacyProps | null>, PharmacyDto {}

export const usePharmacyQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
  _id,
}: UsePharmacyQueryProps): QueryBaseReturnType<PharmacyProps | null> => {
  const queryResult = useQuery({
    queryKey: [...queryPrefixKey, pharmacyQueryKeys.getPharmacy, _id],
    queryFn: () => getPharmacy({ _id }),
    enabled: Boolean(_id) && enabled,
  });

  const { isFetching, isError, error, data, refetch } = queryResult;
  useQueryCallback({ ...queryResult, onSuccess, onError });

  return useMemo(() => {
    return {
      isLoading: isFetching,
      isError,
      error,
      refetch,
      data,
    };
  }, [isFetching, isError, data, error, refetch]);
};

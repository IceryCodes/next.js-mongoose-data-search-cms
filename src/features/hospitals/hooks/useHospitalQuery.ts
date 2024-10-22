import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { HospitalDto } from '@/domains/hospital';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { getHospital, hospitalQueryKeys } from '@/services/hospital';
import { GetHospitalReturnType } from '@/services/interfaces';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface UseHospitalQueryProps extends QueryBaseProps<GetHospitalReturnType>, HospitalDto {}

export const useHospitalQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
  _id,
}: UseHospitalQueryProps): QueryBaseReturnType<GetHospitalReturnType> => {
  const queryResult = useQuery({
    queryKey: [...queryPrefixKey, hospitalQueryKeys.getHospital, _id],
    queryFn: () => getHospital({ _id }),
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

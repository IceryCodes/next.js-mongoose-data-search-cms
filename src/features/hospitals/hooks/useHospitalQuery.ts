import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { HospitalProps } from '@/app/hospitals/interfaces';
import { HospitalDto } from '@/domains/hospital';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { getHospital, hospitalQueryKeys } from '@/services/hospital';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface UseHospitalQueryProps extends QueryBaseProps<HospitalProps | null>, HospitalDto {}

export const useHospitalQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
  _id,
}: UseHospitalQueryProps): QueryBaseReturnType<HospitalProps | null> => {
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

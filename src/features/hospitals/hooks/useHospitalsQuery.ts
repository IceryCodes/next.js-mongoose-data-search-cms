import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { HospitalsDto } from '@/domains/hospital';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { getHospitals, hospitalQueryKeys } from '@/services/hospital';
import { GetHospitalsReturnType } from '@/services/interfaces';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface UseHospitalsQueryProps extends QueryBaseProps<GetHospitalsReturnType>, HospitalsDto {}

export const useHospitalsQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
  query,
  county,
  departments,
  partner,
  category,
  page,
  limit,
}: UseHospitalsQueryProps): QueryBaseReturnType<GetHospitalsReturnType> => {
  const queryResult = useQuery({
    queryKey: [
      ...queryPrefixKey,
      hospitalQueryKeys.getHospitals,
      query,
      county,
      departments,
      partner,
      category,
      page,
      limit,
    ],
    queryFn: () => getHospitals({ query, county, departments, partner, category, page, limit }),
    enabled,
  });

  const {
    isFetching,
    isError,
    error,
    data = {
      hospitals: [],
      total: 0,
      message: '',
    },
    refetch,
  } = queryResult;
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

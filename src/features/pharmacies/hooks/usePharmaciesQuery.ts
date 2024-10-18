import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { PharmaciesDto } from '@/domains/pharmacy';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { GetPharmaciesProps } from '@/services/interfaces';
import { getPharmacies, pharmacyQueryKeys } from '@/services/pharmacy';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface usePharmaciesQueryProps extends QueryBaseProps<GetPharmaciesProps>, PharmaciesDto {}

export const usePharmaciesQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
  query,
  county,
  healthInsuranceAuthorized,
  page,
  limit,
}: usePharmaciesQueryProps): QueryBaseReturnType<GetPharmaciesProps> => {
  const queryResult = useQuery({
    queryKey: [...queryPrefixKey, pharmacyQueryKeys.getPharmacies, query, county, healthInsuranceAuthorized, page, limit],
    queryFn: () => getPharmacies({ query, county, healthInsuranceAuthorized, page, limit }),
    enabled,
  });

  const {
    isFetching,
    isError,
    error,
    data = {
      pharmacies: [],
      total: 0,
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

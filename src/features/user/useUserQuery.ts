import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { GetUserReturnType } from '@/services/interfaces';
import { getUser, userQueryKeys } from '@/services/user';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

export type UsePatientMeQueryProps = QueryBaseProps<GetUserReturnType>;

export const useUserQuery = ({
  onSuccess,
  onError,
  enabled,
  queryPrefixKey = [],
}: UsePatientMeQueryProps = {}): QueryBaseReturnType<GetUserReturnType> => {
  const token = sessionStorage.getItem('token');

  const queryResult = useQuery({
    queryKey: [...queryPrefixKey, userQueryKeys.getUser],
    queryFn: () => (token ? getUser(token) : { user: null, message: '' }),
    enabled,
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

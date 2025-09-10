'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { GetLocationDto } from '@/domains/location';
import { useQueryCallback } from '@/hooks/utils/useQueryCallback';
import { getLocation, locationQueryKeys } from '@/services/location';
import { QueryBaseProps, QueryBaseReturnType } from '@/utils/reactQuery';

interface UseLocationQueryProps extends QueryBaseProps<string>, Partial<GetLocationDto> {}

export const useLocationQuery = ({
  onSuccess,
  onError,
  enabled = true,
  queryPrefixKey = [],
  lat,
  lng,
}: UseLocationQueryProps): QueryBaseReturnType<string> => {
  const queryResult = useQuery({
    queryKey: [...queryPrefixKey, locationQueryKeys.getLocation, lat, lng],
    queryFn: async () => {
      // 如果 parent 已提供座標 → 直接查
      if (lat && lng) {
        return getLocation({ lat, lng });
      }

      // 否則用瀏覽器定位
      if ('geolocation' in navigator) {
        return new Promise<string>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const name = await getLocation({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
                resolve(name);
              } catch (err) {
                reject(err);
              }
            },
            (err) => reject(err),
            { enableHighAccuracy: true }
          );
        });
      }

      return '';
    },
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

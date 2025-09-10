import { GetLocationDto } from '@/domains/location';
import { apiOrigin, logApiError } from '@/utils/api';

export const locationQueryKeys = {
  getLocation: 'getLocation',
} as const;

export const getLocation = async ({ lat, lng }: GetLocationDto): Promise<string> => {
  try {
    const { data: { address: { county, city } } = {} } = await apiOrigin.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'jsonv2',
        lat,
        lon: lng,
        'accept-language': 'zh-TW',
      },
    });
    return (city || county || '').replaceAll('臺', '台');
  } catch (error) {
    const message: string = '搜尋醫院失敗!';
    logApiError({ error, message });

    return '';
  }
};

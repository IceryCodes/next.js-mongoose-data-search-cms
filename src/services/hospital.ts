import { HospitalDto, HospitalsDto } from '@/domains/hospital';
import { apiOrigin, logApiError } from '@/utils/api';

import { GetHospitalReturnType, GetHospitalsReturnType } from './interfaces';

export const hospitalQueryKeys = {
  getHospital: 'getHospital',
  getHospitals: 'getHospitals',
} as const;

export const getHospital = async ({ _id }: HospitalDto): Promise<GetHospitalReturnType> => {
  try {
    const { data } = await apiOrigin.get('/hospital', {
      params: { _id },
    });
    return data;
  } catch (error) {
    const message: string = '搜尋醫院失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const getHospitals = async ({
  query,
  county,
  departments,
  partner,
  category,
  page = 1,
  limit = 10,
}: HospitalsDto): Promise<GetHospitalsReturnType> => {
  try {
    const { data } = await apiOrigin.get('/hospitals', {
      params: { query, county, departments, partner, category, page, limit },
    });

    return {
      hospitals: data.hospitals.length ? data.hospitals : [],
      total: data.total ? data.total : 0,
      message: 'Success',
    };
  } catch (error) {
    const message: string = '搜尋醫院失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

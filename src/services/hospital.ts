import { HospitalProps } from '@/app/hospitals/interfaces';
import { HospitalDto, HospitalsDto } from '@/domains/hospital';
import { apiOrigin } from '@/utils/api';

import { GetHospitalsProps } from './interfaces';

export const hospitalQueryKeys = {
  getHospital: 'getHospital',
  getHospitals: 'getHospitals',
} as const;

export const getHospital = async ({ id }: HospitalDto): Promise<HospitalProps> => {
  const { data } = await apiOrigin.get('/hospital', {
    params: { id },
  });
  return data;
};

export const getHospitals = async ({
  query,
  county,
  departments,
  page = 1,
  limit = 10,
}: HospitalsDto): Promise<GetHospitalsProps> => {
  const { data } = await apiOrigin.get('/hospitals', {
    params: { query, county, departments, page, limit },
  });

  return {
    hospitals: data.hospitals.length ? data.hospitals : [],
    total: data.total ? data.total : 0,
  };
};

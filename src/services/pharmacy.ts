import { PharmaciesDto, PharmacyDto } from '@/domains/pharmacy';
import { apiOrigin, logApiError } from '@/utils/api';

import { GetPharmaciesReturnType, GetPharmacyReturnType } from './interfaces';

export const pharmacyQueryKeys = {
  getPharmacy: 'getPharmacy',
  getPharmacies: 'getPharmacies',
} as const;

export const getPharmacy = async ({ _id }: PharmacyDto): Promise<GetPharmacyReturnType> => {
  try {
    const { data } = await apiOrigin.get('/pharmacy', {
      params: { _id },
    });
    return data;
  } catch (error) {
    const message: string = 'Get pharmacy error';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const getPharmacies = async ({
  query,
  county,
  partner,
  healthInsuranceAuthorized,
  page = 1,
  limit = 10,
}: PharmaciesDto): Promise<GetPharmaciesReturnType> => {
  try {
    const { data } = await apiOrigin.get('/pharmacies', {
      params: { query, county, partner, healthInsuranceAuthorized, page, limit },
    });

    return {
      pharmacies: data.pharmacies.length ? data.pharmacies : [],
      total: data.total ? data.total : 0,
      message: 'Success',
    };
  } catch (error) {
    const message: string = 'Get pharmacies error';
    logApiError({ error, message });

    return {
      pharmacies: [],
      total: 0,
      message,
    };
  }
};

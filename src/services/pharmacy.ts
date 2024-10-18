import axios from 'axios';

import { PharmacyProps } from '@/app/pharmacies/interfaces';
import { PharmaciesDto, PharmacyDto } from '@/domains/pharmacy';
import { apiOrigin } from '@/utils/api';

import { GetPharmaciesProps } from './interfaces';

export const pharmacyQueryKeys = {
  getPharmacy: 'getPharmacy',
  getPharmacies: 'getPharmacies',
} as const;

export const getPharmacy = async ({ _id }: PharmacyDto): Promise<PharmacyProps | null> => {
  try {
    const { data } = await apiOrigin.get('/pharmacy', {
      params: { _id },
    });
    return data;
  } catch (error) {
    // Cast the error to AxiosError
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid _id or pharmacy not found:', error.response.data);
        return null; // Return null if there's a 400 error
      }
    } else {
      console.error('Unexpected error:', error);
    }

    throw error; // Rethrow the error for other statuses or unknown errors
  }
};

export const getPharmacies = async ({
  query,
  county,
  healthInsuranceAuthorized,
  page = 1,
  limit = 10,
}: PharmaciesDto): Promise<GetPharmaciesProps> => {
  try {
    const { data } = await apiOrigin.get('/pharmacies', {
      params: { query, county, healthInsuranceAuthorized, page, limit },
    });

    return {
      pharmacies: data.pharmacies.length ? data.pharmacies : [],
      total: data.total ? data.total : 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching pharmacies:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    return {
      pharmacies: [],
      total: 0,
    }; // Return a safe default if there’s an error
  }
};

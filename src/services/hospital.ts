import axios from 'axios';

import { HospitalProps } from '@/app/hospitals/interfaces';
import { HospitalDto, HospitalsDto } from '@/domains/hospital';
import { apiOrigin } from '@/utils/api';

import { GetHospitalsProps } from './interfaces';

export const hospitalQueryKeys = {
  getHospital: 'getHospital',
  getHospitals: 'getHospitals',
} as const;

export const getHospital = async ({ _id }: HospitalDto): Promise<HospitalProps | null> => {
  try {
    const { data } = await apiOrigin.get('/hospital', {
      params: { _id },
    });
    return data;
  } catch (error) {
    // Cast the error to AxiosError
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        console.error('Invalid _id or hospital not found:', error.response.data);
        return null; // Return null if there's a 400 error
      }
    } else {
      console.error('Unexpected error:', error);
    }

    throw error; // Rethrow the error for other statuses or unknown errors
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
}: HospitalsDto): Promise<GetHospitalsProps> => {
  try {
    const { data } = await apiOrigin.get('/hospitals', {
      params: { query, county, departments, partner, category, page, limit },
    });

    return {
      hospitals: data.hospitals.length ? data.hospitals : [],
      total: data.total ? data.total : 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching hospitals:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    return {
      hospitals: [],
      total: 0,
    }; // Return a safe default if there’s an error
  }
};

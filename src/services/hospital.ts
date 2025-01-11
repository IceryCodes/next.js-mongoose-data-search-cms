import {
  CreateHospitalDto,
  DeleteHospitalDto,
  GetHospitalDto,
  GetHospitalsDto,
  UpdateHospitalDto,
  UpdateHospitalViewDto,
} from '@/domains/hospital';
import { apiOrigin, logApiError } from '@/utils/api';

import { GetHospitalReturnType, GetHospitalsReturnType, HospitalUpdateReturnType } from './interfaces';

export const hospitalQueryKeys = {
  getHospital: 'getHospital',
  getHospitals: 'getHospitals',
} as const;

export const getHospital = async ({ _id }: GetHospitalDto): Promise<GetHospitalReturnType> => {
  try {
    const { data } = await apiOrigin.get('/get-hospital', {
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
  keywords,
  partner,
  category,
  page = 1,
  limit = 10,
}: GetHospitalsDto): Promise<GetHospitalsReturnType> => {
  try {
    const { data } = await apiOrigin.get('/get-hospitals', {
      params: { query, county, departments, keywords: keywords.join(','), partner, category, page, limit },
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

export const updateHospital = async (hospital: UpdateHospitalDto): Promise<HospitalUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.patch(`/update-hospital`, hospital);

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '更新醫院失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const updateHospitalView = async (hospital: UpdateHospitalViewDto): Promise<HospitalUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.post(`/update-hospital-view`, hospital);

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '更新瀏覽次數失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const createHospital = async (hospital: CreateHospitalDto): Promise<HospitalUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.post(`/create-hospital`, hospital);

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '新增醫院失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const deleteHospital = async ({ _id }: DeleteHospitalDto): Promise<HospitalUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.delete(`/delete-hospital`, {
      data: { _id },
    });

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '刪除醫院失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

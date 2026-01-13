import {
  CreatePharmacyDto,
  DeletePharmacyDto,
  GetPharmaciesDto,
  GetPharmacyDto,
  UpdatePharmacyDto,
  UpdatePharmacyViewDto,
} from '@/domains/pharmacy';
import { apiOrigin, logApiError } from '@/utils/api';

import { GetPharmaciesReturnType, GetPharmacyReturnType, PharmacyUpdateReturnType } from './interfaces';

export const pharmacyQueryKeys = {
  getPharmacy: 'getPharmacy',
  getPharmacies: 'getPharmacies',
} as const;

export const getPharmacy = async ({ _id }: GetPharmacyDto): Promise<GetPharmacyReturnType> => {
  try {
    const { data } = await apiOrigin.get('/get-pharmacy', {
      params: { _id },
    });
    return data;
  } catch (error) {
    const message = '搜尋藥局失敗!';
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
}: GetPharmaciesDto): Promise<GetPharmaciesReturnType> => {
  try {
    const { data } = await apiOrigin.get('/get-pharmacies', {
      params: { query, county, partner, healthInsuranceAuthorized, page, limit },
    });

    return {
      pharmacies: data.pharmacies.length ? data.pharmacies : [],
      total: data.total ? data.total : 0,
      message: 'Success',
    };
  } catch (error) {
    const message = '搜尋藥局失敗!';
    logApiError({ error, message });

    return {
      pharmacies: [],
      total: 0,
      message,
    };
  }
};

export const updatePharmacy = async (pharmacy: UpdatePharmacyDto): Promise<PharmacyUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.patch(`/update-pharmacy`, pharmacy);

    return {
      message: data.message,
    };
  } catch (error) {
    const message = '更新藥局失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const updatePharmacyView = async (hospital: UpdatePharmacyViewDto): Promise<PharmacyUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.post(`/update-pharmacy-view`, hospital);

    return {
      message: data.message,
    };
  } catch (error) {
    const message = '更新瀏覽次數失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const createPharmacy = async (hospital: CreatePharmacyDto): Promise<PharmacyUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.post(`/create-pharmacy`, hospital);

    return {
      message: data.message,
    };
  } catch (error) {
    const message = '新增藥局失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const deletePharmacy = async ({ _id }: DeletePharmacyDto): Promise<PharmacyUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.delete(`/delete-pharmacy`, {
      data: { _id },
    });

    return {
      message: data.message,
    };
  } catch (error) {
    const message = '刪除藥局失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

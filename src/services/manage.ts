import { CreateManageDto } from '@/domains/manage';
import { apiOrigin, logApiError } from '@/utils/api';

import { ManageUpdateReturnType } from './interfaces';

export const updateManages = async (manages: CreateManageDto): Promise<ManageUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.post(`/update-manages`, manages);

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '更新管理機構失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

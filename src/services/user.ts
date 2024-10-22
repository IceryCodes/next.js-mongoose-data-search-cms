import { GetUserReturnType } from '@/services/interfaces';
import { apiOrigin, logApiError } from '@/utils/api';

export const userQueryKeys = {
  getUser: 'getUser',
} as const;

export const getUser = async (token: string): Promise<GetUserReturnType> => {
  try {
    const { data } = await apiOrigin.get('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    const message: string = 'Get user error';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

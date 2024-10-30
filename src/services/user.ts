import { DeleteUserDto, UserVerifyDto } from '@/domains/user';
import { GetUserReturnType, UserUpdateReturnType, UserVerifyReturnType } from '@/services/interfaces';
import { apiOrigin, logApiError } from '@/utils/api';

export const userQueryKeys = {
  getUser: 'getUser',
  verifyUser: 'verifyUser',
} as const;

export const getUser = async (token: string): Promise<GetUserReturnType> => {
  try {
    const { data } = await apiOrigin.get('/get-user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    const message: string = '搜尋帳號失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const verifyUser = async ({ token }: UserVerifyDto): Promise<UserVerifyReturnType> => {
  try {
    const { data } = await apiOrigin.get('/user-verify', {
      params: { token },
    });
    return data;
  } catch (error) {
    const message: string = '帳號驗證失敗!';
    logApiError({ error, message });

    throw { message };
  }
};

export const deleteUser = async ({ _id }: DeleteUserDto): Promise<UserUpdateReturnType> => {
  try {
    const { data } = await apiOrigin.delete(`/delete-user`, {
      data: { _id },
    });

    return {
      message: data.message,
    };
  } catch (error) {
    const message: string = '刪除帳號失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

import { UserLoginDto, UserRegisterDto, UserResendVerificationDto } from '@/domains/user';
import { UserLoginReturnType, UserResendVerificationReturnType } from '@/services/interfaces';
import { apiOrigin, logApiError } from '@/utils/api';

export const userRegister = async ({
  firstName,
  lastName,
  gender,
  email,
  password,
}: UserRegisterDto): Promise<UserLoginReturnType> => {
  try {
    const { data } = await apiOrigin.post('/user-register', {
      firstName,
      lastName,
      gender,
      email,
      password,
    });
    return data;
  } catch (error) {
    const message: string = '註冊失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const userLogin = async ({ email, password }: UserLoginDto): Promise<UserLoginReturnType> => {
  try {
    const { data } = await apiOrigin.post('/user-login', { email, password });
    return data;
  } catch (error) {
    const message: string = '登入失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const userResendVerification = async ({
  _id,
}: UserResendVerificationDto): Promise<UserResendVerificationReturnType> => {
  try {
    const { data } = await apiOrigin.post('/resend-verification', { _id });
    return data;
  } catch (error) {
    const message: string = '登入失敗!';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

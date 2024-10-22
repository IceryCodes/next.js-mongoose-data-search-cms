import { UserLoginDto, UserRegisterDto } from '@/domains/user';
import { UserLoginReturnType } from '@/services/interfaces';
import { apiOrigin, logApiError } from '@/utils/api';

export const userRegister = async ({
  firstName,
  lastName,
  email,
  password,
}: UserRegisterDto): Promise<UserLoginReturnType> => {
  try {
    const { data } = await apiOrigin.post('/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return data;
  } catch (error) {
    const message: string = 'Register failed';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

export const userLogin = async ({ email, password }: UserLoginDto): Promise<UserLoginReturnType> => {
  try {
    const { data } = await apiOrigin.post('/login', { email, password });
    return data;
  } catch (error) {
    const message: string = 'User not found';
    logApiError({ error, message });

    return {
      message,
    };
  }
};

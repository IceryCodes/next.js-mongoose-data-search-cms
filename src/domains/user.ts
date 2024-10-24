import { ObjectId } from 'mongodb';

import { GenderType, UserRoleType } from './interfaces';

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  firstName: string;
  lastName: string;
  gender: GenderType;
  email: string;
  password: string;
}

export interface UserVerifyDto {
  token: string;
}

export interface UserResendVerificationDto {
  _id: string;
}

export interface UserWithPasswordProps extends UserRegisterDto {
  _id: ObjectId;
  role: UserRoleType;
  isVerified: boolean;
}

export type UserProps = Omit<UserWithPasswordProps, 'password'>;

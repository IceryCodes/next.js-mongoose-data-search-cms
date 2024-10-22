import { ObjectId } from 'mongodb';

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserProps extends Omit<UserRegisterDto, 'password'> {
  _id: ObjectId;
}

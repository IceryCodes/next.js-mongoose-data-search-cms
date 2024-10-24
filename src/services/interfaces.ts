import { HospitalProps } from '@/domains/hospital';
import { PharmacyProps } from '@/domains/pharmacy';
import { UserProps } from '@/domains/user';

export interface GetHospitalReturnType {
  hospital?: HospitalProps | null;
  message: string;
}

export interface GetHospitalsReturnType {
  hospitals?: HospitalProps[];
  total?: number;
  message: string;
}

export interface GetPharmacyReturnType {
  pharmacy?: PharmacyProps | null;
  message: string;
}

export interface GetPharmaciesReturnType {
  pharmacies?: PharmacyProps[];
  total?: number;
  message: string;
}

export interface GetUserReturnType {
  user?: UserProps | null;
  message: string;
}

export interface UserRegisterReturnType {
  token?: string;
  message: string;
}

export interface UserLoginReturnType {
  token?: string;
  user?: UserProps;
  message: string;
}

export interface UserVerifyReturnType {
  message: string;
}

export interface UserResendVerificationReturnType {
  message: string;
}

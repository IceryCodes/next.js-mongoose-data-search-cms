import { DepartmentsType, HospitalCategoryType } from '@/app/hospitals/interfaces';

export interface HospitalDto {
  _id: string;
}

export interface HospitalsDto {
  query: string;
  county: string;
  departments: DepartmentsType;
  partner: boolean;
  category: HospitalCategoryType;
  page?: number;
  limit?: number;
}

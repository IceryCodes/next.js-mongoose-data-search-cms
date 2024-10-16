import { DepartmentsType } from '@/app/hospitals/interfaces';

export interface HospitalDto {
  id: string;
}

export interface HospitalsDto {
  query: string;
  county: string;
  departments: DepartmentsType;
  page?: number;
  limit?: number;
}

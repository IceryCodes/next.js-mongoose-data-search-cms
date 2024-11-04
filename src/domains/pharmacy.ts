import { ObjectId } from 'mongodb';

import { CountyType, DistrictType, GenderType } from '@/domains/interfaces';

export interface GetPharmacyDto {
  _id: string;
}

export interface GetPharmaciesDto {
  query: string;
  county: string;
  partner: boolean;
  healthInsuranceAuthorized: boolean;
  page?: number;
  limit?: number;
}

export interface PharmacyProps {
  _id: ObjectId;
  partner: boolean;
  orgCode: string;
  owner?: string;
  gender?: GenderType;
  doctors?: string[];
  websiteUrl?: string;
  email?: string;
  phone?: string;
  county: CountyType;
  district: DistrictType;
  address: string;
  title: string;
  excerpt?: string;
  content?: string;
  keywords?: string[];
  featuredImg?: string;
  healthInsuranceAuthorized: boolean;
  managers?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UpdatePharmacyProps = Omit<PharmacyProps, '_id' | 'createdAt' | 'updatedAt'>;
export interface UpdatePharmacyDto extends UpdatePharmacyProps, Pick<PharmacyProps, '_id'> {}
export type CreatePharmacyDto = UpdatePharmacyProps;
export type DeletePharmacyDto = Pick<PharmacyProps, '_id'>;

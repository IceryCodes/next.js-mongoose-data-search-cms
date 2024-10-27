import { ObjectId } from 'mongodb';

import { CountyType, GenderType } from '@/domains/interfaces';

export interface PharmacyDto {
  _id: string;
}

export interface PharmaciesDto {
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
  owner: string;
  gender: GenderType;
  doctors: string[];
  websiteUrl: string;
  email: string;
  phone: string;
  county: CountyType;
  district: DistrictType;
  address: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  featuredImg: string;
  healthInsuranceAuthorized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

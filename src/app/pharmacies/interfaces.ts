import { ObjectId } from 'mongodb';

import { CountyType, GenderType } from '../components/interface';

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
  district: string;
  address: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  featuredImg: string;
  healthInsuranceAuthorized: boolean;
}

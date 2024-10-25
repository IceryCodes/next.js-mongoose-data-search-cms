import { ObjectId } from 'mongodb';

import { CountyType, GenderType } from '@/domains/interfaces';

export enum HospitalCategoryType {
  Hospital = 'hospital',
  Clinic = 'clinic',
}

export enum DepartmentsType {
  GeneralTraditionalChineseMedicine = '中醫一般科',
  InternalMedicine = '內科',
  Other = '其他',
  Surgical = '外科',
  ObstetricsAndGynecology = '婦產科',
  HomeMedicine = '家醫科',
  Pediatrics = '小兒科',
  RehabilitationDepartment = '復健科',
  DepartmentOfEmergencyMedicine = '急診醫學科',
  Radiology = '放射科',
  PlasticSurgery = '整形外科',
  DepartmentOfNuclearMedicine = '核子醫學科',
  Urology = '泌尿科',
  NephrologyDepartment = '洗腎科',
  Dentistry = '牙科',
  PathologyDepartment = '病理科',
  Dermatology = '皮膚科',
  Ophthalmology = '眼科',
  Neurosurgery = '神經外科',
  Neurology = '神經科',
  Psychiatry = '精神科',
  Otolaryngology = '耳鼻喉科',
  DepartmentOfOccupationalMedicine = '職業醫學科',
  Orthopedics = '骨科',
  AnesthesiaDepartment = '麻醉科',
}

export interface HospitalProps {
  _id: ObjectId;
  partner: boolean;
  orgCode: string;
  owner: string;
  gender: GenderType;
  doctors: string[];
  departments: DepartmentsType[];
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
  ['語言治療師']: number;
  ['牙體技術師']: number;
  ['聽力師']: number;
  ['牙體技術士']: number;
  ['驗光師']: number;
  ['驗光生']: number;
  ['醫師']: number;
  ['中醫師']: number;
  ['牙醫師']: number;
  ['藥師']: number;
  ['藥劑生']: number;
  ['護理師']: number;
  ['護士']: number;
  ['助產士']: number;
  ['助產師']: number;
  ['醫事檢驗師']: number;
  ['醫事檢驗生']: number;
  ['物理治療師']: number;
  ['職能治療師']: number;
  ['醫事放射師']: number;
  ['醫事放射士']: number;
  ['物理治療生']: number;
  ['職能治療生']: number;
  ['呼吸治療師']: number;
  ['諮商心理師']: number;
  ['臨床心理師']: number;
  ['營養師']: number;
  createdAt: Date;
  updatedAt: Date;
}

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

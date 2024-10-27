import { ObjectId } from 'mongodb';

import { CountyType, DistrictType, GenderType } from '@/domains/interfaces';

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

export enum HospitalExtraFieldType {
  SpeechTherapist = '語言治療師',
  DentalTechnician = '牙體技術師',
  Audiologist = '聽力師',
  DentalTechnicianAssistant = '牙體技術士',
  Optometrist = '驗光師',
  OptometricAssistant = '驗光生',
  Physician = '醫師',
  ChineseMedicineDoctor = '中醫師',
  Dentist = '牙醫師',
  Pharmacist = '藥師',
  PharmacyAssistant = '藥劑生',
  RegisteredNurse = '護理師',
  Nurse = '護士',
  Midwife = '助產士',
  MidwiferyAssistant = '助產師',
  MedicalLaboratoryTechnologist = '醫事檢驗師',
  MedicalLaboratoryAssistant = '醫事檢驗生',
  PhysicalTherapist = '物理治療師',
  OccupationalTherapist = '職能治療師',
  RadiologicTechnologist = '醫事放射師',
  RadiologicAssistant = '醫事放射士',
  PhysicalTherapyAssistant = '物理治療生',
  OccupationalTherapyAssistant = '職能治療生',
  RespiratoryTherapist = '呼吸治療師',
  CounselingPsychologist = '諮商心理師',
  ClinicalPsychologist = '臨床心理師',
  Dietitian = '營養師',
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
  district: DistrictType;
  address: string;
  title: string;
  excerpt: string;
  content: string;
  keywords: string[];
  featuredImg: string;
  [HospitalExtraFieldType.SpeechTherapist]: number;
  [HospitalExtraFieldType.DentalTechnician]: number;
  [HospitalExtraFieldType.Audiologist]: number;
  [HospitalExtraFieldType.DentalTechnicianAssistant]: number;
  [HospitalExtraFieldType.Optometrist]: number;
  [HospitalExtraFieldType.OptometricAssistant]: number;
  [HospitalExtraFieldType.Physician]: number;
  [HospitalExtraFieldType.ChineseMedicineDoctor]: number;
  [HospitalExtraFieldType.Dentist]: number;
  [HospitalExtraFieldType.Pharmacist]: number;
  [HospitalExtraFieldType.PharmacyAssistant]: number;
  [HospitalExtraFieldType.RegisteredNurse]: number;
  [HospitalExtraFieldType.Nurse]: number;
  [HospitalExtraFieldType.Midwife]: number;
  [HospitalExtraFieldType.MidwiferyAssistant]: number;
  [HospitalExtraFieldType.MedicalLaboratoryTechnologist]: number;
  [HospitalExtraFieldType.MedicalLaboratoryAssistant]: number;
  [HospitalExtraFieldType.PhysicalTherapist]: number;
  [HospitalExtraFieldType.OccupationalTherapist]: number;
  [HospitalExtraFieldType.RadiologicTechnologist]: number;
  [HospitalExtraFieldType.RadiologicAssistant]: number;
  [HospitalExtraFieldType.PhysicalTherapyAssistant]: number;
  [HospitalExtraFieldType.OccupationalTherapyAssistant]: number;
  [HospitalExtraFieldType.RespiratoryTherapist]: number;
  [HospitalExtraFieldType.CounselingPsychologist]: number;
  [HospitalExtraFieldType.ClinicalPsychologist]: number;
  [HospitalExtraFieldType.Dietitian]: number;
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

export type HospitalUpdateDto = Omit<HospitalProps, '_id' | 'createdAt' | 'updatedAt'>;

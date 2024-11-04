import { ObjectId } from 'mongodb';

export enum ManageCategoryType {
  Hospital = 'hospital',
  Clinic = 'clinic',
  Pharmacy = 'pharmacy',
}

export interface HospitalManageProps {
  _id: ObjectId;
  user_id: ObjectId;
  hospital_id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PharmacyManageProps {
  _id: ObjectId;
  user_id: ObjectId;
  pharmacy_id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateManageDto {
  user_id: string;
  entity_type: ManageCategoryType;
  entity_ids: string[];
}

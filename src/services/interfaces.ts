import {
  GoogleAddressComponent,
  GoogleBusinessStatus,
  GoogleGeometry,
  GoogleOpeningHours,
  GooglePhoto,
  GooglePlusCode,
  GoogleReview,
} from '@/domains/google';
import { HospitalProps } from '@/domains/hospital';
import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { UserProps } from '@/domains/user';

export interface GetHospitalReturnType {
  hospital?: HospitalProps | null;
  manage?: boolean;
  message: string;
}

export interface GetHospitalsReturnType {
  hospitals?: HospitalProps[];
  total?: number;
  message: string;
}

export interface HospitalUpdateReturnType {
  message: string;
}

export interface PharmacyUpdateReturnType {
  message: string;
}

export interface ManageUpdateReturnType {
  message: string;
}

export interface GetPharmacyReturnType {
  pharmacy?: PharmacyProps | null;
  manage?: boolean;
  message: string;
}

export interface GetPharmaciesReturnType {
  pharmacies?: PharmacyProps[];
  total?: number;
  message: string;
}

export interface ManageProps {
  [ManageCategoryType.Hospital]: HospitalProps[];
  [ManageCategoryType.Clinic]: HospitalProps[];
  [ManageCategoryType.Pharmacy]: PharmacyProps[];
}

export interface GetUserReturnType {
  user?: UserProps;
  manage?: ManageProps;
  message: string;
}

export interface GetUsersReturnType {
  users?: UserProps[];
  total?: number;
  message: string;
}

export interface UserRegisterReturnType {
  token?: string;
  message: string;
}

export interface UserLoginReturnType {
  token?: string;
  message: string;
}

export interface UserVerifyReturnType {
  message: string;
}

export interface UserResendVerificationReturnType {
  message: string;
}

export interface UserUpdateReturnType {
  message: string;
}

export interface GetGoogleInfosReturnType {
  address_components: GoogleAddressComponent[];
  adr_address: string;
  business_status: GoogleBusinessStatus;
  formatted_address: string;
  formatted_phone_number?: string;
  geometry: GoogleGeometry | null;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  international_phone_number?: string;
  name: string;
  opening_hours?: GoogleOpeningHours | null;
  photos: GooglePhoto[];
  place_id: string;
  plus_code?: GooglePlusCode | null;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
  website: string;
  price_level: number | null;
  rating: number;
  reviews: GoogleReview[];
  user_ratings_total: number;
  scope: string;
  permanently_closed: boolean;
  reservable: boolean;
  serves_beer: boolean;
  serves_breakfast: boolean;
  serves_brunch: boolean;
  serves_dinner: boolean;
  serves_lunch: boolean;
  serves_vegetarian_food: boolean;
  takeout: boolean;
}

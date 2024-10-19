import { HospitalProps } from '@/app/hospitals/interfaces';
import { PharmacyProps } from '@/app/pharmacies/interfaces';

export interface GetHospitalsProps {
  hospitals: HospitalProps[];
  total: number;
}

export interface GetPharmaciesProps {
  pharmacies: PharmacyProps[];
  total: number;
}

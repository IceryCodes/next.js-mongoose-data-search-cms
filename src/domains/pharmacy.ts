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

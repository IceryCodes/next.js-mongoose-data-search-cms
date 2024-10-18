export interface PharmacyDto {
  _id: string;
}

export interface PharmaciesDto {
  query: string;
  county: string;
  healthInsuranceAuthorized: boolean;
  page?: number;
  limit?: number;
}

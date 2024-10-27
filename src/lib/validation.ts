import * as yup from 'yup';
import {
  AnyObject,
  array,
  ArraySchema,
  boolean,
  BooleanSchema,
  mixed,
  MixedSchema,
  number,
  NumberSchema,
  object,
  string,
  StringSchema,
} from 'yup';

import { DepartmentsType, HospitalExtraFieldType } from '@/domains/hospital';
import { CountyType, districtOptions, DistrictOptionsProps, DistrictType, GenderType } from '@/domains/interfaces';

interface RulesProps {
  //user
  firstName: StringSchema<string, AnyObject, undefined, ''>;
  lastName: StringSchema<string, AnyObject, undefined, ''>;
  email: StringSchema<string, AnyObject, undefined, ''>;
  password: StringSchema<string, AnyObject, undefined, ''>;
  gender: MixedSchema<NonNullable<GenderType | undefined>, AnyObject, undefined, ''>;

  // hospital
  partner: BooleanSchema<boolean, AnyObject>;
  orgCode: StringSchema<string, AnyObject>;
  owner: StringSchema<string, AnyObject>;
  doctors: ArraySchema<string[], AnyObject, '', ''>;
  departments: ArraySchema<DepartmentsType[], AnyObject, '', ''>;
  websiteUrl: StringSchema<string, AnyObject, undefined, ''>;
  phone: StringSchema<string, AnyObject>;
  county: StringSchema<CountyType, AnyObject>;
  district: MixedSchema<DistrictType, AnyObject>;
  address: StringSchema<string, AnyObject>;
  title: StringSchema<string, AnyObject>;
  excerpt: StringSchema<string, AnyObject>;
  content: StringSchema<string, AnyObject>;
  keywords: ArraySchema<string[], AnyObject, '', ''>;
  featuredImg: StringSchema<string, AnyObject>;
  [HospitalExtraFieldType.SpeechTherapist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.DentalTechnician]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Audiologist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.DentalTechnicianAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Optometrist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.OptometricAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Physician]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.ChineseMedicineDoctor]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Dentist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Pharmacist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.PharmacyAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.RegisteredNurse]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Nurse]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Midwife]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.MidwiferyAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.MedicalLaboratoryTechnologist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.MedicalLaboratoryAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.PhysicalTherapist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.OccupationalTherapist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.RadiologicTechnologist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.RadiologicAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.PhysicalTherapyAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.OccupationalTherapyAssistant]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.RespiratoryTherapist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.CounselingPsychologist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.ClinicalPsychologist]: NumberSchema<number, AnyObject>;
  [HospitalExtraFieldType.Dietitian]: NumberSchema<number, AnyObject>;
}

const rules: RulesProps = {
  // user
  firstName: string().required('名字是必填項目').min(2, '名字至少需要2個字'),
  lastName: string().required('姓氏是必填項目').min(2, '姓氏至少需要2個字'),
  email: string().email('無效的信箱格式').required('信箱是必填項目'),
  password: yup
    .string()
    .required('密碼是必填項目')
    .min(8, '密碼至少需要8個字')
    .matches(/(?=.*[0-9])(?=.*[A-Z])/, '密碼必須包含至少一個數字和一個大寫字母'),
  gender: mixed<GenderType>().oneOf([GenderType.Male, GenderType.Female], '性別是必填項目').required('性別是必填項目'),

  // hospital
  partner: boolean().required('必須選擇是否為合作夥伴'),
  orgCode: string().required('機構代碼是必填項目'),
  owner: string().required('擁有者是必填項目'),
  doctors: array().of(string().required()).required(),
  departments: array().of(mixed<DepartmentsType>().required()).required(),
  websiteUrl: string().url('無效的網址格式').required(),
  phone: string().required('電話是必填項目'),
  county: string().oneOf(Object.values(CountyType), '縣市必須是有效的選項').required(),
  district: mixed<DistrictType>()
    .test('is-valid-district', '請選擇有效的區域', function (value) {
      const county: keyof DistrictOptionsProps = this.parent.county;
      if (!county) return true;

      const validDistricts = districtOptions[county];
      return typeof value === 'string' && Object.values(validDistricts).includes(value);
    })
    .required('區域為必填'),
  address: string().required('地址是必填項目'),
  title: string().required('名稱是必填項目'),
  excerpt: string().required(),
  content: string().required(),
  keywords: array().of(string().required()).required(),
  featuredImg: string().url('無效的圖片網址格式').required(),
  [HospitalExtraFieldType.SpeechTherapist]: number().required(),
  [HospitalExtraFieldType.DentalTechnician]: number().required(),
  [HospitalExtraFieldType.Audiologist]: number().required(),
  [HospitalExtraFieldType.DentalTechnicianAssistant]: number().required(),
  [HospitalExtraFieldType.Optometrist]: number().required(),
  [HospitalExtraFieldType.OptometricAssistant]: number().required(),
  [HospitalExtraFieldType.Physician]: number().required(),
  [HospitalExtraFieldType.ChineseMedicineDoctor]: number().required(),
  [HospitalExtraFieldType.Dentist]: number().required(),
  [HospitalExtraFieldType.Pharmacist]: number().required(),
  [HospitalExtraFieldType.PharmacyAssistant]: number().required(),
  [HospitalExtraFieldType.RegisteredNurse]: number().required(),
  [HospitalExtraFieldType.Nurse]: number().required(),
  [HospitalExtraFieldType.Midwife]: number().required(),
  [HospitalExtraFieldType.MidwiferyAssistant]: number().required(),
  [HospitalExtraFieldType.MedicalLaboratoryTechnologist]: number().required(),
  [HospitalExtraFieldType.MedicalLaboratoryAssistant]: number().required(),
  [HospitalExtraFieldType.PhysicalTherapist]: number().required(),
  [HospitalExtraFieldType.OccupationalTherapist]: number().required(),
  [HospitalExtraFieldType.RadiologicTechnologist]: number().required(),
  [HospitalExtraFieldType.RadiologicAssistant]: number().required(),
  [HospitalExtraFieldType.PhysicalTherapyAssistant]: number().required(),
  [HospitalExtraFieldType.OccupationalTherapyAssistant]: number().required(),
  [HospitalExtraFieldType.RespiratoryTherapist]: number().required(),
  [HospitalExtraFieldType.CounselingPsychologist]: number().required(),
  [HospitalExtraFieldType.ClinicalPsychologist]: number().required(),
  [HospitalExtraFieldType.Dietitian]: number().required(),
};

export const registerValidationSchema = object({
  firstName: rules.firstName,
  lastName: rules.lastName,
  email: rules.email,
  password: rules.password,
  gender: rules.gender,
});

export const loginValidationSchema = object({
  email: rules.email,
  password: rules.password,
});

export const hospitalValidationSchema = object({
  partner: rules.partner,
  orgCode: rules.orgCode,
  owner: rules.owner,
  gender: rules.gender,
  doctors: rules.doctors,
  departments: rules.departments,
  websiteUrl: rules.websiteUrl,
  email: rules.email,
  phone: rules.phone,
  county: rules.county,
  district: rules.district,
  address: rules.address,
  title: rules.title,
  excerpt: rules.excerpt,
  content: rules.content,
  keywords: rules.keywords,
  featuredImg: rules.featuredImg,
  [HospitalExtraFieldType.SpeechTherapist]: rules[HospitalExtraFieldType.SpeechTherapist],
  [HospitalExtraFieldType.DentalTechnician]: rules[HospitalExtraFieldType.DentalTechnician],
  [HospitalExtraFieldType.Audiologist]: rules[HospitalExtraFieldType.Audiologist],
  [HospitalExtraFieldType.DentalTechnicianAssistant]: rules[HospitalExtraFieldType.DentalTechnicianAssistant],
  [HospitalExtraFieldType.Optometrist]: rules[HospitalExtraFieldType.Optometrist],
  [HospitalExtraFieldType.OptometricAssistant]: rules[HospitalExtraFieldType.OptometricAssistant],
  [HospitalExtraFieldType.Physician]: rules[HospitalExtraFieldType.Physician],
  [HospitalExtraFieldType.ChineseMedicineDoctor]: rules[HospitalExtraFieldType.ChineseMedicineDoctor],
  [HospitalExtraFieldType.Dentist]: rules[HospitalExtraFieldType.Dentist],
  [HospitalExtraFieldType.Pharmacist]: rules[HospitalExtraFieldType.Pharmacist],
  [HospitalExtraFieldType.PharmacyAssistant]: rules[HospitalExtraFieldType.PharmacyAssistant],
  [HospitalExtraFieldType.RegisteredNurse]: rules[HospitalExtraFieldType.RegisteredNurse],
  [HospitalExtraFieldType.Nurse]: rules[HospitalExtraFieldType.Nurse],
  [HospitalExtraFieldType.Midwife]: rules[HospitalExtraFieldType.Midwife],
  [HospitalExtraFieldType.MidwiferyAssistant]: rules[HospitalExtraFieldType.MidwiferyAssistant],
  [HospitalExtraFieldType.MedicalLaboratoryTechnologist]: rules[HospitalExtraFieldType.MedicalLaboratoryTechnologist],
  [HospitalExtraFieldType.MedicalLaboratoryAssistant]: rules[HospitalExtraFieldType.MedicalLaboratoryAssistant],
  [HospitalExtraFieldType.PhysicalTherapist]: rules[HospitalExtraFieldType.PhysicalTherapist],
  [HospitalExtraFieldType.OccupationalTherapist]: rules[HospitalExtraFieldType.OccupationalTherapist],
  [HospitalExtraFieldType.RadiologicTechnologist]: rules[HospitalExtraFieldType.RadiologicTechnologist],
  [HospitalExtraFieldType.RadiologicAssistant]: rules[HospitalExtraFieldType.RadiologicAssistant],
  [HospitalExtraFieldType.PhysicalTherapyAssistant]: rules[HospitalExtraFieldType.PhysicalTherapyAssistant],
  [HospitalExtraFieldType.OccupationalTherapyAssistant]: rules[HospitalExtraFieldType.OccupationalTherapyAssistant],
  [HospitalExtraFieldType.RespiratoryTherapist]: rules[HospitalExtraFieldType.RespiratoryTherapist],
  [HospitalExtraFieldType.CounselingPsychologist]: rules[HospitalExtraFieldType.CounselingPsychologist],
  [HospitalExtraFieldType.ClinicalPsychologist]: rules[HospitalExtraFieldType.ClinicalPsychologist],
  [HospitalExtraFieldType.Dietitian]: rules[HospitalExtraFieldType.Dietitian],
});

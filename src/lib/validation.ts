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

import { DepartmentsType } from '@/domains/hospital';
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
  ['語言治療師']: NumberSchema<number, AnyObject>;
  ['牙體技術師']: NumberSchema<number, AnyObject>;
  ['聽力師']: NumberSchema<number, AnyObject>;
  ['牙體技術士']: NumberSchema<number, AnyObject>;
  ['驗光師']: NumberSchema<number, AnyObject>;
  ['驗光生']: NumberSchema<number, AnyObject>;
  ['醫師']: NumberSchema<number, AnyObject>;
  ['中醫師']: NumberSchema<number, AnyObject>;
  ['牙醫師']: NumberSchema<number, AnyObject>;
  ['藥師']: NumberSchema<number, AnyObject>;
  ['藥劑生']: NumberSchema<number, AnyObject>;
  ['護理師']: NumberSchema<number, AnyObject>;
  ['護士']: NumberSchema<number, AnyObject>;
  ['助產士']: NumberSchema<number, AnyObject>;
  ['助產師']: NumberSchema<number, AnyObject>;
  ['醫事檢驗師']: NumberSchema<number, AnyObject>;
  ['醫事檢驗生']: NumberSchema<number, AnyObject>;
  ['物理治療師']: NumberSchema<number, AnyObject>;
  ['職能治療師']: NumberSchema<number, AnyObject>;
  ['醫事放射師']: NumberSchema<number, AnyObject>;
  ['醫事放射士']: NumberSchema<number, AnyObject>;
  ['物理治療生']: NumberSchema<number, AnyObject>;
  ['職能治療生']: NumberSchema<number, AnyObject>;
  ['呼吸治療師']: NumberSchema<number, AnyObject>;
  ['諮商心理師']: NumberSchema<number, AnyObject>;
  ['臨床心理師']: NumberSchema<number, AnyObject>;
  ['營養師']: NumberSchema<number, AnyObject>;
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
  ['語言治療師']: number().required(),
  ['牙體技術師']: number().required(),
  ['聽力師']: number().required(),
  ['牙體技術士']: number().required(),
  ['驗光師']: number().required(),
  ['驗光生']: number().required(),
  ['醫師']: number().required(),
  ['中醫師']: number().required(),
  ['牙醫師']: number().required(),
  ['藥師']: number().required(),
  ['藥劑生']: number().required(),
  ['護理師']: number().required(),
  ['護士']: number().required(),
  ['助產士']: number().required(),
  ['助產師']: number().required(),
  ['醫事檢驗師']: number().required(),
  ['醫事檢驗生']: number().required(),
  ['物理治療師']: number().required(),
  ['職能治療師']: number().required(),
  ['醫事放射師']: number().required(),
  ['醫事放射士']: number().required(),
  ['物理治療生']: number().required(),
  ['職能治療生']: number().required(),
  ['呼吸治療師']: number().required(),
  ['諮商心理師']: number().required(),
  ['臨床心理師']: number().required(),
  ['營養師']: number().required(),
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
  ['語言治療師']: rules['語言治療師'],
  ['牙體技術師']: rules['牙體技術師'],
  ['聽力師']: rules['聽力師'],
  ['牙體技術士']: rules['牙體技術士'],
  ['驗光師']: rules['驗光師'],
  ['驗光生']: rules['驗光生'],
  ['醫師']: rules['醫師'],
  ['中醫師']: rules['中醫師'],
  ['牙醫師']: rules['牙醫師'],
  ['藥師']: rules['藥師'],
  ['藥劑生']: rules['藥劑生'],
  ['護理師']: rules['護理師'],
  ['護士']: rules['護士'],
  ['助產士']: rules['助產士'],
  ['助產師']: rules['助產師'],
  ['醫事檢驗師']: rules['醫事檢驗師'],
  ['醫事檢驗生']: rules['醫事檢驗生'],
  ['物理治療師']: rules['物理治療師'],
  ['職能治療師']: rules['職能治療師'],
  ['醫事放射師']: rules['醫事放射師'],
  ['醫事放射士']: rules['醫事放射士'],
  ['物理治療生']: rules['物理治療生'],
  ['職能治療生']: rules['職能治療生'],
  ['呼吸治療師']: rules['呼吸治療師'],
  ['諮商心理師']: rules['諮商心理師'],
  ['臨床心理師']: rules['臨床心理師'],
  ['營養師']: rules['營養師'],
});

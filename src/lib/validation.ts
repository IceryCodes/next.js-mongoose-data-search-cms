import * as yup from 'yup';
import { AnyObject, MixedSchema, StringSchema } from 'yup';

import { GenderType } from '@/domains/interfaces';

interface RulesProps {
  firstName: StringSchema<string, AnyObject, undefined, ''>;
  lastName: StringSchema<string, AnyObject, undefined, ''>;
  email: StringSchema<string, AnyObject, undefined, ''>;
  password: StringSchema<string, AnyObject, undefined, ''>;
  gender: MixedSchema<NonNullable<GenderType | undefined>, AnyObject, undefined, ''>;
}

const rules: RulesProps = {
  firstName: yup.string().required('名字是必填項目').min(2, '名字至少需要2個字'),
  lastName: yup.string().required('姓氏是必填項目').min(2, '姓氏至少需要2個字'),
  email: yup.string().email('無效的信箱格式').required('信箱是必填項目'),
  password: yup
    .string()
    .required('密碼是必填項目')
    .min(8, '密碼至少需要8個字')
    .matches(/(?=.*[0-9])(?=.*[A-Z])/, '密碼必須包含至少一個數字和一個大寫字母'),
  gender: yup.mixed<GenderType>().oneOf([GenderType.Male, GenderType.Female], '性別是必填項目').required('性別是必填項目'),
};

export const registerValidationSchema = yup.object({
  firstName: rules.firstName,
  lastName: rules.lastName,
  email: rules.email,
  password: rules.password,
  gender: rules.gender,
});

export const loginValidationSchema = yup.object({
  email: rules.email,
  password: rules.password,
});

import { Control, Controller, ControllerRenderProps } from 'react-hook-form';

import { Button } from '@/app/global-components/buttons/Button';
import { DepartmentsType, DoctorProps, UpdateHospitalProps } from '@/domains/hospital';
import { GenderType } from '@/domains/interfaces';

interface DoctorFormProps {
  control: Control<UpdateHospitalProps, unknown>;
}

interface DoctorCardProps {
  doctor: DoctorProps;
  index: number;
  field: ControllerRenderProps<UpdateHospitalProps, 'doctors'>;
  inputStyle: string;
}

const inputStyle = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400';

export const DoctorForm = ({ control }: DoctorFormProps) => {
  return (
    <div className="flex flex-col col-span-6">
      <label>醫院醫生</label>
      <Controller
        name="doctors"
        control={control}
        render={({ field }) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              {(field.value || []).map((doctor: DoctorProps, index: number) => (
                <DoctorCard key={index} doctor={doctor} index={index} field={field} inputStyle={inputStyle} />
              ))}
            </div>
            <Button
              text="新增醫生"
              onClick={() => {
                const newDoctor: DoctorProps = {
                  name: '',
                  gender: GenderType.None,
                  departments: [],
                  educationalQualifications: [],
                };
                field.onChange([...(field.value || []), newDoctor]);
              }}
              className="mt-4"
            />
          </>
        )}
      />
    </div>
  );
};

const DoctorCard = ({ doctor, index, field, inputStyle }: DoctorCardProps) => (
  <div className="border p-4 rounded">
    <input
      className={`${inputStyle} mb-2`}
      type="text"
      value={doctor.name}
      onChange={(e) => {
        const newDoctors = [...(field.value || [])];
        newDoctors[index] = { ...doctor, name: e.target.value };
        field.onChange(newDoctors);
      }}
      placeholder="醫生姓名"
    />

    <select
      className="border rounded px-4 py-2 w-full mb-2"
      value={doctor.gender}
      onChange={(e) => {
        const newDoctors = [...(field.value || [])];
        newDoctors[index] = { ...doctor, gender: Number(e.target.value) };
        field.onChange(newDoctors);
      }}
    >
      <option value={GenderType.None}>選擇性別</option>
      <option value={GenderType.Male}>男</option>
      <option value={GenderType.Female}>女</option>
    </select>

    <select
      multiple
      className="border rounded px-4 py-2 w-full mb-2"
      value={doctor.departments}
      onChange={(e) => {
        const selectedDepartments = Array.from(e.target.selectedOptions, (option) => option.value as DepartmentsType);
        const newDoctors = [...(field.value || [])];
        newDoctors[index] = { ...doctor, departments: selectedDepartments };
        field.onChange(newDoctors);
      }}
    >
      {Object.values(DepartmentsType).map((dept) => (
        <option key={dept} value={dept}>
          {dept}
        </option>
      ))}
    </select>

    <input
      className={inputStyle}
      type="text"
      value={doctor.educationalQualifications?.join(',')}
      onChange={(e) => {
        const newDoctors = [...(field.value || [])];
        newDoctors[index] = {
          ...doctor,
          educationalQualifications: e.target.value ? e.target.value.split(',') : [],
        };
        field.onChange(newDoctors);
      }}
      placeholder="學歷 (多個用半形逗號分隔)"
    />

    <Button
      text="移除"
      onClick={() => {
        const newDoctors = (field.value || []).filter((_: DoctorProps, i: number) => i !== index);
        field.onChange(newDoctors);
      }}
      className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
    />
  </div>
);

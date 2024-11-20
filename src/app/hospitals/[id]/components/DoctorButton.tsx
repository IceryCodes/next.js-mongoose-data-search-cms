import { ReactElement, useState } from 'react';

import { Button } from '@/app/global-components/buttons/Button';
import Popup from '@/app/global-components/Popup';
import { DoctorProps } from '@/domains/hospital';
import { useEnum } from '@/hooks/utils/useEnum';

const DoctorButton = ({ doctor }: { doctor: DoctorProps }) => {
  const { name, gender, departments, educationalQualifications } = doctor;
  const { composeGender } = useEnum();

  const [display, setDisplay] = useState<boolean>(false);

  const PopUpInfo = (): ReactElement => (
    <Popup title={`${name}醫師`} display={display} onClose={() => setDisplay(false)}>
      <div className="min-w-[500px]">
        <div className="mx-auto w-fit">
          <ul className="text-start list-decimal list-inside">
            <li>性別: {composeGender(gender)}</li>
            <li>專長: {departments.join(', ')}</li>
            <li>學歷: {educationalQualifications.join(', ')}</li>
          </ul>
        </div>
      </div>
    </Popup>
  );

  return (
    <>
      <Button text={doctor.name} onClick={() => setDisplay(true)} />
      <PopUpInfo />
    </>
  );
};

export default DoctorButton;

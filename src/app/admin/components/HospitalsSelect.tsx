import { ReactElement, useMemo, useState } from 'react';

import { Button } from '@/app/global-components/buttons/Button';
import { HospitalProps } from '@/domains/hospital';
import { PharmacyProps } from '@/domains/pharmacy';

interface HospitalsSelectProps {
  hospitals: (HospitalProps | PharmacyProps)[];
  selectedHospitals: (HospitalProps | PharmacyProps)[];
  onChange: (newTargetKeys: (HospitalProps | PharmacyProps)[]) => void;
}

const HospitalsSelect = ({ hospitals, selectedHospitals, onChange }: HospitalsSelectProps): ReactElement => {
  const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
  const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>([]);

  const itemArray = useMemo(
    () => hospitals.filter((item) => !selectedHospitals.some((selected) => selected.address === item.address)),
    [hospitals, selectedHospitals]
  );

  const selectedArray = useMemo(
    () => hospitals.filter((item) => selectedHospitals.some((selected) => selected.address === item.address)),
    [hospitals, selectedHospitals]
  );

  const handleTransferToTarget = () => {
    const newTargetKeys = [
      ...selectedHospitals,
      ...hospitals.filter((hospital) => selectedSourceKeys.includes(hospital.address)),
    ];
    setSelectedSourceKeys([]);
    onChange(newTargetKeys);
  };

  const handleTransferToSource = () => {
    const newTargetKeys = selectedHospitals.filter((selected) => !selectedTargetKeys.includes(selected.address));
    setSelectedTargetKeys([]);
    onChange(newTargetKeys);
  };

  return (
    <div className="flex gap-4 h-[300px]">
      {/* Source List */}
      <div className="flex-grow border pt-0 rounded w-full overflow-y-scroll">
        <div className="shadow-md mb-2 p-2 sticky top-0 z-10 bg-white">
          <label className="font-bold">搜尋結果</label>
        </div>

        <ul className="space-y-2 p-4">
          {!itemArray.length && <label>沒有相關資訊</label>}
          {itemArray.map((item) => (
            <li
              key={item.address}
              className={`flex flex-col cursor-pointer p-2 rounded ${
                selectedSourceKeys.includes(item.address) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() =>
                setSelectedSourceKeys((prev) =>
                  prev.includes(item.address) ? prev.filter((key) => key !== item.address) : [...prev, item.address]
                )
              }
            >
              <span>{item.title}</span>
              <span className="text-sm ml-4">{`${item.county}${item.district}${item.address}`}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-col justify-center items-center space-y-4 w-1/6">
        <Button text="選擇" onClick={handleTransferToTarget} disabled={selectedSourceKeys.length === 0} className="w-full" />
        <Button text="移除" onClick={handleTransferToSource} disabled={selectedTargetKeys.length === 0} className="w-full" />
      </div>

      {/* Target List */}
      <div className="flex-grow border pt-0 rounded w-full overflow-y-scroll">
        <div className="shadow-md mb-2 p-2 sticky top-0 z-10 bg-white">
          <label className="font-bold">選擇項目</label>
        </div>

        <ul className="space-y-2 p-4">
          {!selectedArray.length && <label>請從左側進行挑選</label>}
          {selectedArray.map((item) => (
            <li
              key={item.address}
              className={`flex flex-col cursor-pointer p-2 rounded ${
                selectedTargetKeys.includes(item.address) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() =>
                setSelectedTargetKeys((prev) =>
                  prev.includes(item.address) ? prev.filter((key) => key !== item.address) : [...prev, item.address]
                )
              }
            >
              <span>{item.title}</span>
              <span className="text-sm ml-4">{`${item.county}${item.district}${item.address}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HospitalsSelect;

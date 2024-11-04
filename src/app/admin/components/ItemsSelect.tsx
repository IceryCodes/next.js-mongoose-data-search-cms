import { DragEvent, ReactElement, useMemo, useState } from 'react';

import { Button } from '@/app/global-components/buttons/Button';
import { HospitalProps } from '@/domains/hospital';
import { PharmacyProps } from '@/domains/pharmacy';

interface ItemsSelectProps {
  hospitals: (HospitalProps | PharmacyProps)[];
  selectedItems: (HospitalProps | PharmacyProps)[];
  setSelectedItems: (newTargetKeys: (HospitalProps | PharmacyProps)[]) => void;
}

const ItemsSelect = ({ hospitals, selectedItems, setSelectedItems }: ItemsSelectProps): ReactElement => {
  const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
  const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFromSource, setDraggedFromSource] = useState<boolean>(false);

  const itemArray = useMemo(
    () => hospitals.filter((item) => !selectedItems.some((selected) => selected.address === item.address)),
    [hospitals, selectedItems]
  );

  const selectedArray = useMemo(
    () => hospitals.filter((item) => selectedItems.some((selected) => selected.address === item.address)),
    [hospitals, selectedItems]
  );

  const handleTransferToTarget = () => {
    const newTargetKeys = [
      ...selectedItems,
      ...hospitals.filter((hospital) => selectedSourceKeys.includes(hospital.address)),
    ];
    setSelectedSourceKeys([]);
    setSelectedItems(newTargetKeys);
  };

  const handleTransferToSource = () => {
    const newTargetKeys = selectedItems.filter((selected) => !selectedTargetKeys.includes(selected.address));
    setSelectedTargetKeys([]);
    setSelectedItems(newTargetKeys);
  };

  // Handle drag events
  const handleDragStart = (address: string, fromSource: boolean) => {
    setDraggedItem(address);
    setDraggedFromSource(fromSource);
  };

  const handleDragOver = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLUListElement>, isTarget: boolean) => {
    event.preventDefault();
    if (draggedItem) {
      if (isTarget) {
        // Add dragged item to selected
        const draggedHospital = hospitals.find((hospital) => hospital.address === draggedItem);
        if (draggedHospital && !selectedItems.includes(draggedHospital)) {
          setSelectedItems([...selectedItems, draggedHospital]);
        }
      } else {
        // Remove dragged item from selected
        const newTargetKeys = selectedItems.filter((selected) => selected.address !== draggedItem);
        setSelectedItems(newTargetKeys);
      }
      setDraggedItem(null);
      setDraggedFromSource(false);
    }
  };

  return (
    <div className="flex gap-4 h-[300px]">
      {/* Source List */}
      <div
        className={`flex-grow border pt-0 rounded w-full overflow-y-scroll ${
          draggedItem && !draggedFromSource ? 'border-2 border-blue-400 shadow-lg' : ''
        }`}
      >
        <div className="shadow-md mb-2 p-2 sticky top-0 z-10 bg-white">
          <label className="font-bold">{`搜尋結果 (${itemArray.length})`}</label>
        </div>

        <ul className="space-y-2 p-4" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, false)}>
          {!itemArray.length && <label>沒有相關資訊</label>}
          {itemArray.map((item) => (
            <li
              key={item.address}
              draggable
              onDragStart={() => handleDragStart(item.address, true)}
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
      <div
        className={`flex-grow border pt-0 rounded w-full overflow-y-scroll ${
          draggedItem && draggedFromSource ? 'border-2 border-blue-400 shadow-lg' : ''
        }`}
      >
        <div className="shadow-md mb-2 p-2 sticky top-0 z-10 bg-white">
          <label className="font-bold">{`選擇項目 (${selectedArray.length})`}</label>
        </div>

        <ul className="space-y-2 p-4" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, true)}>
          {!selectedArray.length && <label>請從左側進行挑選</label>}
          {selectedArray.map((item) => (
            <li
              key={item.address}
              draggable
              onDragStart={() => handleDragStart(item.address, false)}
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

export default ItemsSelect;

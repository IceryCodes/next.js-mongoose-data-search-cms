'use client';

import { ReactElement, useCallback, useMemo, useState } from 'react';

import { ObjectId } from 'mongodb';

import { useToast } from '@/contexts/ToastContext';
import { useDeleteHospitalMutation } from '@/features/hospitals/hooks/useDeleteHospitalMutation';

import { Button } from '../buttons/Button';
import Popup from '../Popup';

interface DeleteHospitalContentProps {
  _id: ObjectId;
  title: string;
  afterDelete: () => void;
}

const DeleteHospitalContent = ({ _id, title, afterDelete }: DeleteHospitalContentProps) => {
  const { isLoading, mutateAsync } = useDeleteHospitalMutation();
  const { showToast } = useToast();

  const [display, setDisplay] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    try {
      const result = await mutateAsync({ _id });
      if (typeof result === 'string') throw new Error(result);

      const { message } = result;
      if (message) showToast({ message });

      setDisplay(false);
      afterDelete();
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [_id, afterDelete, mutateAsync, showToast]);

  const form = useMemo(
    (): ReactElement => (
      <Popup title="刪除醫院或診所" display={display} onClose={() => setDisplay(false)}>
        <div className="flex flex-col w-[500px]">
          {isLoading && <label>刪除中...</label>}

          <div className="flex justify-center items-center gap-x-4">
            <label>{`確定要刪除${title}嗎?`}</label>
            <Button text="確定" onClick={onSubmit} />
          </div>
        </div>
      </Popup>
    ),
    [display, isLoading, onSubmit, title]
  );

  const onClick = () => setDisplay(true);

  return (
    <>
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-600 transition"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      {form}
    </>
  );
};

export default DeleteHospitalContent;

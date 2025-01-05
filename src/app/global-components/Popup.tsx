'use client';

import { ReactElement } from 'react';

import { Button } from '@/app/global-components/buttons/Button';

export enum PopupStyleType {
  Normal = 'bg-blue-400',
  Warning = 'bg-red-400',
}

interface PopupProps {
  title: string;
  children: ReactElement;
  display: boolean;
  noBlackBg?: boolean;
  onClose: () => void;
}

const Popup = ({ title, children, display, noBlackBg = false, onClose }: PopupProps): ReactElement => {
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center bg-opacity-40 transition-all duration-300 ${display ? 'opacity-100' : 'opacity-0'} ${display ? 'z-20' : '-z-20'} ${display && !noBlackBg ? 'bg-black' : 'bg-transparent'}`}
        onClick={onClose}
      >
        <div
          className={`fixed bg-white rounded shadow-lg p-4 m-4 flex flex-col gap-4 max-w-6xl overflow-y-auto transition-all duration-300 ${display ? 'max-h-content' : 'max-h-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && <label className="text-2xl font-bold">{title}</label>}
          {children}
          <Button
            element={<span className="text-2xl">&times;</span>}
            onClick={onClose}
            className="absolute top-2 right-4 bg-white hover:text-red-400"
          />
        </div>
      </div>
    </>
  );
};

export default Popup;

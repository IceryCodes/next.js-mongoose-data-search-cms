'use client';

import { ReactElement, useEffect } from 'react';

import { Button } from './buttons/Button';

export enum ToastStyleType {
  Normal = 'bg-blue-400',
  Warning = 'bg-red-400',
}

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  toastStyle?: ToastStyleType;
}

const Toast = ({ message, onClose, duration = 5000, toastStyle = ToastStyleType.Normal }: ToastProps): ReactElement => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`${toastStyle} z-20 fixed bottom-5 w-80 p-4 text-white rounded shadow-lg transition-all duration-${duration} ease-in-out ${message ? 'opacity-100' : 'opacity-0'} ${message ? 'right-5' : '-right-96'}`}
    >
      {message}
      <Button
        element={<span className="text-lg">&times;</span>}
        onClick={onClose}
        className="absolute top-2 right-4 text-white hover:text-gray-300"
      />
    </div>
  );
};

export default Toast;

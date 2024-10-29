import { createContext, ReactElement, useContext, useState } from 'react';

import Toast, { ToastStyleType } from '@/app/components/Toast';

interface ShowToastProps {
  message: string;
  duration?: number;
  toastStyle?: ToastStyleType;
}

interface ToastContextProps {
  showToast: (info: ShowToastProps) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const defaultToastInfo: ShowToastProps = { message: '' };

export const ToastProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const [toast, setToast] = useState<ShowToastProps>(defaultToastInfo);

  const showToast = ({ message, duration = 3000, toastStyle = ToastStyleType.Normal }: ShowToastProps) => {
    setToast({ message, duration, toastStyle });

    setTimeout(() => {
      setToast(defaultToastInfo);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        onClose={() => setToast(defaultToastInfo)}
        duration={toast.duration}
        toastStyle={toast.toastStyle}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

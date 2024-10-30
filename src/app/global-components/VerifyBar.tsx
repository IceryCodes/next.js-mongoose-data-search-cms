'use client';

import { ReactElement, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { Button } from '@/app/global-components/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getPageUrlByType, PageType } from '@/domains/interfaces';
import { useResendVerificationMutation } from '@/features/user/useAuthMutation';

import { ToastStyleType } from './Toast';

const VerifyBar = (): ReactElement => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();
  const { isLoading, mutateAsync } = useResendVerificationMutation();
  const [verifyBarDisplay, setVerifyBarDisplay] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  const resendVerification = async () => {
    if (!user?._id) {
      showToast({ message: '寄送錯誤!' });
      logout();
      return;
    }

    setResendDisabled(true);
    setCountdown(60);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setResendDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const result = await mutateAsync({ _id: user._id.toString() });
      if (result.message) showToast({ message: result.message });
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  let buttonText: string = isLoading ? '寄送中...' : '重寄驗證信';
  if (resendDisabled) buttonText = `${buttonText} (${countdown})`;

  useEffect(() => {
    if (!pathname?.includes(`${getPageUrlByType(PageType.VERIFY)}`))
      setVerifyBarDisplay(isAuthenticated && !user?.isVerified);
  }, [isAuthenticated, pathname, user?.isVerified]);

  return (
    <div
      className={`h-16 w-full ${ToastStyleType.Warning} fixed ${verifyBarDisplay ? 'bottom-0' : '-bottom-16'} transition-all duration-1000 ease-in-out z-10 shadow-md`}
    >
      <div className="container h-full p-4 m-auto flex justify-center items-center gap-4">
        <label className="font-bold text-white">尚未驗證帳號</label>
        <Button text={buttonText} disabled={resendDisabled} onClick={resendVerification} />
        <Button
          element={<span className="text-lg">&times;</span>}
          onClick={() => setVerifyBarDisplay(false)}
          className="absolute top-2 right-4 text-white hover:text-gray-300"
        />
      </div>
    </div>
  );
};

export default VerifyBar;

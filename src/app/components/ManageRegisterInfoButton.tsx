'use client';

import { ReactElement, useMemo, useState } from 'react';

import { Button } from '@/app/global-components/buttons/Button';

import Popup from '../global-components/Popup';
const ManageRegisterInfoButton = (): ReactElement => {
  const [display, setDisplay] = useState<boolean>(false);

  const form = useMemo(
    (): ReactElement => (
      <Popup title="如何申請管理機構資訊?" display={display} noBlackBg onClose={() => setDisplay(false)}>
        <div className="max-w-[500px]">
          <div className="mx-auto w-fit">
            <ul className="text-start list-decimal list-inside">
              <li>請先至想申請的機構頁面</li>
              <li>
                登入後查看標題左側部是否出現申請圖標
                <ul className="pl-5 list-disc list-inside">
                  <li>若該機構尚無管理人員標題尾部將出現申請圖標 (📝)</li>
                  <li>若已有管理人員則不會顯示，請該機構聯絡管理人員進行協作</li>
                </ul>
              </li>
              <li>點擊圖標進行管理權限申請</li>
            </ul>
          </div>
        </div>
      </Popup>
    ),
    [display]
  );

  const onClick = () => setDisplay(true);

  return (
    <>
      <Button text="管理機構資訊" onClick={onClick} className="bg-pink-500 hover:bg-pink-600 scale-100 hover:scale-105" />
      {form}
    </>
  );
};

export default ManageRegisterInfoButton;

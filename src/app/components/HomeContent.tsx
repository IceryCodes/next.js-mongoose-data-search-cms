'use client';

import { ReactElement } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/app/global-components/buttons/Button';
import { getPageUrlByType, PageType } from '@/domains/interfaces';

const HomeContent = (): ReactElement => {
  const router = useRouter();

  return (
    <div className="relative" id="home">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40">
        <div className="blur-[106px] h-96 bg-gradient-to-br from-pink-300 to-pink-200"></div>
        <div className="blur-[106px] h-64 bg-gradient-to-tl from-cyan-300 to-sky-200"></div>
      </div>
      <div className="container mx-auto flex flex-col gap-y-10 py-10">
        {/* 介紹區塊 */}
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold mb-4">探索全台醫療資源</h2>
          <p className="mb-4 text-gray-700 text-lg">整合全台所有醫院、診所和藥局，讓您輕鬆搜尋和比較不同的醫療服務。</p>
          <p className="mb-6 text-gray-500">如果您是醫療機構的管理者，可以註冊編輯您的機構資訊，讓更多人了解您的服務。</p>
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-center gap-x-4">
              <Button
                text="搜尋醫院"
                onClick={() => router.push(getPageUrlByType(PageType.HOSPITALS))}
                className="scale-100 hover:scale-105"
              />
              <Button
                text="搜尋診所"
                onClick={() => router.push(getPageUrlByType(PageType.CLINICS))}
                className="scale-100 hover:scale-105"
              />
              <Button
                text="搜尋藥局"
                onClick={() => router.push(getPageUrlByType(PageType.PHARMACIES))}
                className="scale-100 hover:scale-105"
              />
            </div>
            <div>
              <Button
                text="管理機構資訊"
                onClick={() => router.push(getPageUrlByType(PageType.REGISTER))}
                className="bg-pink-500 hover:bg-pink-600 scale-100 hover:scale-105"
              />
            </div>
          </div>
        </div>

        <div className="py-8 border-y border-gray-300 grid grid-cols-3 gap-x-4">
          <div className="text-left col-span-1 flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">🏥 醫院</h6>
            <p className="text-gray-500">我們的醫院資訊將幫助您找到急診、住院或專科醫療服務。</p>
          </div>
          <div className="text-left col-span-1 flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">🩺 診所</h6>
            <p className="text-gray-500">在這裡，您可以找到各類型的診所，提供從普通門診到專科診療的服務。</p>
          </div>
          <div className="text-left col-span-1 flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700 dark:text-white">💊 藥局</h6>
            <p className="text-gray-500">我們整合了全台各地的藥局，方便您隨時找到需要的藥品和健康產品。</p>
          </div>
        </div>

        {/* 更多資訊區塊 */}
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">更多健康資訊</h2>
          <p className="mb-6 text-gray-700">在這裡，您可以找到更多與健康相關的資源和指南，幫助您做出明智的健康決策。</p>
          <Button text="了解更多" className="px-6 py-3 scale-100 hover:scale-105" />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;

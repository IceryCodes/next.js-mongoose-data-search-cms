'use client';

import { ReactElement } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button, ButtonStyleType } from '@/app/global-components/buttons/Button';
import { getPageUrlByType, PageType } from '@/domains/interfaces';

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

interface ServiceCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  onClick: () => void;
}

const features: Feature[] = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'AI 智能推薦',
    description: '運用先進AI技術，為您推薦最適合的醫療機構',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: '睡眠專科搜尋',
    description: '特別針對睡眠問題提供專業醫療資源',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: '精準比較',
    description: '多維度數據分析，協助您做出最佳選擇',
  },
];

const services = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
      </svg>
    ),
    title: '醫院搜尋',
    description: '我們的醫院資訊將幫助您找到各地的專科醫療服務',
    page: getPageUrlByType(PageType.HOSPITALS),
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    title: '診所搜尋',
    description: '您可以在這裡找到各類型的診所，提供從普通門診到專科診療的服務',
    page: getPageUrlByType(PageType.CLINICS),
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z" />
      </svg>
    ),
    title: '藥局搜尋',
    description: '我們整合了全台各地的藥局，方便您隨時找到附近有健保特約的藥局',
    page: getPageUrlByType(PageType.PHARMACIES),
  },
];

const ServiceCard = ({ icon, title, description, onClick }: ServiceCardProps): ReactElement => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomeContent = (): ReactElement => {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-32">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-40 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">探索全台優質醫療資源</h1>
              <p className="text-lg md:text-xl text-gray-600">
                本平台結合多元數據來源與AI技術，提供客觀且精準的醫療院所推薦。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button text="立即搜尋" onClick={() => router.push(getPageUrlByType(PageType.HOSPITALS))} />
                <Button text="了解更多" onClick={() => router.push('#features')} buttonStyle={ButtonStyleType.Disabled} />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Image
                src="/assets/medical-service.png"
                alt="醫療服務示意圖"
                width={720}
                height={480}
                className="w-auto h-auto"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-16 bg-white/80">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">這個平台能做什麼?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, title, description }, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">{icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="relative py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">醫療資源一站搜尋</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(({ icon, title, description, page }, index) => (
              <ServiceCard
                key={index}
                icon={icon}
                title={title}
                description={description}
                onClick={() => router.push(page)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;

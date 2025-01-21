import { MetadataRoute } from 'next';

import { getPageUrlByType, PageType } from '@/domains/interfaces';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const disallow: string[] = [
    '/api/*', // 禁止爬取所有 API 路徑
    '/admin/', // 禁止爬取管理介面
    '/private/', // 禁止爬取私密內容
    '/*.json', // 禁止爬取 JSON 檔案
    '/tmp/', // 禁止爬取臨時檔案
    '/draft/', // 禁止爬取草稿內容
    getPageUrlByType(PageType.ADMIN),
    getPageUrlByType(PageType.LOGIN),
    // getPageUrlByType(PageType.REGISTER),
    getPageUrlByType(PageType.VERIFY),
    getPageUrlByType(PageType.PROFILE),
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/hospitals/*', '/clinics/*', '/pharmacies/*'],
        disallow,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/hospitals/*', '/clinics/*', '/pharmacies/*'],
        disallow,
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/*'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/hospitals/*', '/clinics/*', '/pharmacies/*'],
        disallow: ['/*'],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: ['/', '/hospitals/*', '/clinics/*', '/pharmacies/*'],
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import checkNext from 'next-rate-limit';

import { HttpStatus } from './utils/api';

const requests: number = Number(process.env.NEXT_PRIVATE_REQUESTS_LIMIT) || 1000; // 增加預設請求限制

const limiter = checkNext({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 2000, // 大幅增加來提升寬鬆度
});

// 檢查是否為搜尋引擎爬蟲
function isSearchEngineCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
  ];

  return crawlerPatterns.some((pattern) => pattern.test(userAgent));
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const userAgent = req.headers.get('user-agent') || '';

  // Lowercase redirection for non-API routes only
  if (!pathname.startsWith('/api') && pathname !== pathname.toLowerCase()) {
    const lowercaseUrl = `${pathname.toLowerCase()}${search}`;
    return NextResponse.redirect(new URL(lowercaseUrl, req.url));
  }

  // Rate limiting only for API routes, but exclude search engine crawlers
  if (pathname.startsWith('/api') && process.env.NODE_ENV === 'production' && !isSearchEngineCrawler(userAgent)) {
    try {
      await limiter.checkNext(req, requests);
    } catch {
      // If rate limit is exceeded, respond with 429 status
      return NextResponse.json(
        {
          message: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: HttpStatus.TooManyRequests,
        }
      );
    }
  }

  // Add more permissive CORS headers
  const res = NextResponse.next();

  // 允許所有來源 (對於公開網站更友善)
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 添加對搜尋引擎友善的標頭
  res.headers.set('X-Robots-Tag', 'index, follow');

  // 移除可能阻擋爬蟲的標頭
  res.headers.delete('X-Frame-Options');

  return res;
}

export const config = {
  // 更精確的 matcher，減少不必要的中間件執行
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

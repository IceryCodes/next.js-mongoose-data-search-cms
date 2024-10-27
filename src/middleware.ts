import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import checkNext from 'next-rate-limit';

import { HttpStatus } from './utils/api';

const requests: number = Number(process.env.NEXT_PRIVATE_REQUESTS_LIMIT); // requests limit per minute

const limiter = checkNext({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Adjust as needed
});

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Lowercase redirection for non-API routes only
  if (!pathname.startsWith('/api') && pathname !== pathname.toLowerCase()) {
    const lowercaseUrl = `${pathname.toLowerCase()}${search}`;
    return NextResponse.redirect(new URL(lowercaseUrl, req.url));
  }

  // Rate limiting only for API routes
  if (pathname.startsWith('/api') && process.env.NODE_ENV === 'production') {
    try {
      await limiter.checkNext(req, requests);
    } catch {
      // If rate limit is exceeded, respond with 429 status
      return NextResponse.json({ Icery: 'Take it easy, bro. Too many requests!' }, { status: HttpStatus.TooManyRequests });
    }
  }

  // Add CORS headers to the response
  const res = NextResponse.next();
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL);
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return res;
}

export const config = {
  matcher: ['/', '/((?!api).*)', '/api/:path*'], // Apply to all routes, but handle logic in middleware
};

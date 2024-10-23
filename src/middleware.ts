import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Check if the pathname has uppercase letters
  if (/[A-Z]/.test(url.pathname)) {
    // Redirect to the lowercase version of the URL
    url.pathname = url.pathname.toLowerCase();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

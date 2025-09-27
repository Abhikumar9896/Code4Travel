import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = ['/dashboard'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requiresAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

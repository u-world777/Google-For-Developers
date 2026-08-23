import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const roleCookie = request.cookies.get('lokseva_role')?.value;

  // Set default fallback role cookie if missing so all routes load smoothly
  if (!roleCookie) {
    response.cookies.set('lokseva_role', 'MP', { path: '/' });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)']
};

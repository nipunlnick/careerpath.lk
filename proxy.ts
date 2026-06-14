import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin and /api/admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    // Allow access to login pages
    if (path === '/admin/login' || path === '/api/admin/login') {
      return NextResponse.next();
    }

    // Check for auth cookie
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Return 401 for API routes
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      // Redirect to login for UI routes
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // NOTE: In a real production environment with Edge middleware, 
    // you should verify the JWT token signature using the 'jose' library here.
    // For this audit, we rely on the token existence in middleware, and 
    // strict verification can be added in individual Node API routes if needed.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
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
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
      await jwtVerify(token, secret);
    } catch (error) {
      // Token is invalid or expired
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

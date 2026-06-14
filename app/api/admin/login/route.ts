import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Sign a secure JWT token
      const token = jwt.sign({ role: 'admin', username }, jwtSecret, { expiresIn: '1d' });
      
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

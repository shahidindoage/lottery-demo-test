// app/api/admin/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete the cookie
  response.cookies.set({
    name: 'admin_auth',
    value: '',
    path: '/',
    expires: new Date(0), // Expire immediately
    httpOnly: true,
  });

  return response;
}

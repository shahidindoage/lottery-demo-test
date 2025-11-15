// app/api/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_auth', '', {
    path: '/',
    expires: new Date(0), // instantly expire cookie
  });
  return res;
}

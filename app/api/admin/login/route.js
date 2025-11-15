import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  // Find admin
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || admin.password !== password) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  // Set cookie with username and role
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_auth', JSON.stringify({ username: admin.username, role: admin.role }), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return res;
}

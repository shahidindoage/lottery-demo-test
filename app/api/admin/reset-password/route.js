import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, currentPass, newPass } = body;

    if (!username || !currentPass || !newPass) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find the admin to update
    const adminToUpdate = await prisma.admin.findUnique({ where: { username } });
    if (!adminToUpdate) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Find the logged-in admin from cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_auth=([^;]+)/);
    if (!match) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const auth = JSON.parse(decodeURIComponent(match[1])); // { username, role }
    const loggedInUsername = auth.username;
    const loggedInRole = auth.role;

    // Permission check
    if (loggedInRole === 'MANAGER' && loggedInUsername !== username) {
      return NextResponse.json({ error: 'Managers can only change their own password' }, { status: 403 });
    }

    // If updating own password, check current password
    if (loggedInUsername === username && adminToUpdate.password !== currentPass) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    await prisma.admin.update({
      where: { username },
      data: { password: newPass },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

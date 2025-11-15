// /app/api/users/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.lotterySubmission.findMany({
      orderBy: { createdAt: 'asc' },
      select: { name: true, phone: true, uniqueId: true },
    });
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

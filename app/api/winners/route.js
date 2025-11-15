import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const winners = await prisma.lotterySubmission.findMany({
      where: { winner: 1 },
      orderBy: { createdAt: 'asc' },
      select: { name: true, uniqueId: true, prize: true },
    });
    return NextResponse.json({ winners });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

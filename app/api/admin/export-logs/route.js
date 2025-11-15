import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const logs = await prisma.exportLogs.findMany({
      orderBy: { exportedAt: 'desc' },
    });

    return NextResponse.json({ success: true, logs });
  } catch (err) {
    console.error('Fetch Logs Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

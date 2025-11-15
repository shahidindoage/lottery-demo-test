import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  try {
    // ✅ Extract IP address from forwarded headers
    let ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // ✅ Handle localhost IPv6 shorthand (::1)
    if (ip === '::1' || ip === '127.0.0.1') ip = 'localhost';

    // ✅ Extract browser info
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // ✅ Log export action (if exportLogs table exists)
    await prisma.exportLogs.create({
      data: {
        ipAddress: ip,
        userAgent,
        exportedAt: new Date(),
      },
    });

    // ✅ Fetch submission data
    const submissions = await prisma.lotterySubmission.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (!submissions.length) {
      return new Response('No data available', { status: 404 });
    }

    // ✅ Prepare CSV data
    const header = [
      'Customer ID',
      'Name',
      'Phone',
      'Accepted Terms',
      'Winner',
      'Created At',
    ];
    const rows = submissions.map((s) => [
      s.uniqueId,
      s.name,
      s.phone,
      s.accepted_terms ? 'Yes' : 'No',
      s.winner === 1 ? 'Winner' : 'No',
      new Date(s.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

    // ✅ Return CSV file for download
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="submissions.csv"',
      },
    });
  } catch (err) {
    console.error('Export Error:', err);
    return new Response('Server error', { status: 500 });
  }
}

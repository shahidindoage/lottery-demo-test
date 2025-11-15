import { prisma } from '../../../../lib/prisma';

export async function GET(req) {
  const key = req.headers.get('x-admin-key');
  if (!key || key !== process.env.ADMIN_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await prisma.lotterySubmission.findMany({
      orderBy: { created_at: 'desc' },
    });
    return Response.json({ submissions });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

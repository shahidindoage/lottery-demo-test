import { prisma } from '../../../../lib/prisma';

export async function DELETE() {
  try {
    await prisma.lotterySubmission.deleteMany();
    return Response.json({ success: true, message: 'All submissions deleted' });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to delete submissions' }, { status: 500 });
  }
}

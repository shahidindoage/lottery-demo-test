import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const allow = formData.get('allow') === 'true';

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: { allowRegistration: allow },
    create: { id: 1, allowRegistration: allow },
  });

  return NextResponse.redirect('/admin/dashboard');
}

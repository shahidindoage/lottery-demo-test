// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';
// import twilio from 'twilio';

// const prisma = new PrismaClient();
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, terms, privacy } = body;

//     if (!name || !terms || !email || !phone) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Find last entry to generate next uniqueId
//     const lastEntry = await prisma.lotterySubmission.findFirst({
//       orderBy: { id: 'desc' },
//       select: { uniqueId: true },
//     });

//     let nextIdNumber = 100;
//     if (lastEntry && !isNaN(parseInt(lastEntry.uniqueId))) {
//       nextIdNumber = parseInt(lastEntry.uniqueId) + 1;
//     }

//     const nextUniqueId = nextIdNumber.toString().padStart(3, '0');

//     // Create new record
//     const newEntry = await prisma.lotterySubmission.create({
//       data: {
//         uniqueId: nextUniqueId,
//         name,
//         email,
//         phone,
//         accepted_terms: terms,
//         accepted_privacy: privacy || false,
//         winner: 0,
//         prize: null,
//       },
//     });

//     await client.messages.create({
//       body: `✅ Hi ${name}, your registration for the lottery was successful! Your unique ID is ${nextUniqueId}. Good luck! 🎉`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phone, // Must include country code, e.g. "+91XXXXXXXXXX"
//     });

//     return NextResponse.json({ success: true, uniqueId: newEntry.uniqueId });
//   } catch (err) {
//     console.error('Registration error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, terms, privacy } = body;

    if (!name || !terms || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🔐 Check duplicate email
    const emailExists = await prisma.lotterySubmission.findUnique({
      where: { email },
    });
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email already registered.' },
        { status: 400 }
      );
    }

    // 🔐 Check duplicate phone
    const phoneExists = await prisma.lotterySubmission.findUnique({
      where: { phone },
    });
    if (phoneExists) {
      return NextResponse.json(
        { error: 'Phone number already registered.' },
        { status: 400 }
      );
    }

    // Find last entry for uniqueId
    const lastEntry = await prisma.lotterySubmission.findFirst({
      orderBy: { id: 'desc' },
      select: { uniqueId: true },
    });

    let nextIdNumber = 100;
    if (lastEntry && !isNaN(parseInt(lastEntry.uniqueId))) {
      nextIdNumber = parseInt(lastEntry.uniqueId) + 1;
    }

    const nextUniqueId = nextIdNumber.toString().padStart(3, '0');

    // Create entry
    const newEntry = await prisma.lotterySubmission.create({
      data: {
        uniqueId: nextUniqueId,
        name,
        email,
        phone,
        accepted_terms: terms,
        accepted_privacy: privacy || false,
        winner: 0,
      },
    });

    return NextResponse.json({ success: true, uniqueId: newEntry.uniqueId });

  } catch (err) {
    console.error('Registration error:', err);

    // Prisma duplicate error fallback
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email or phone already registered.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

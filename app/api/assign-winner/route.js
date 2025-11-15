import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
// import twilio from 'twilio';

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const { uniqueId, prize, cardNumber } = await req.json();

    // ✅ Find the user
    const user = await prisma.lotterySubmission.findUnique({
      where: { uniqueId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Update winner info
    await prisma.lotterySubmission.update({
      where: { uniqueId },
      data: { winner: 1, prize, cardNumber },
    });

    // ✅ Send SMS to the winner (if phone number exists)
    // if (user.phone) {
    //   await client.messages.create({
    //     body: `🎉 Congratulations! You’ve won the ${prize} in our lottery! (Card #${cardNumber})`,
    //     from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number (e.g. +1XXXXXXX)
    //     to: user.phone, // must include country code (e.g. +9198XXXXXXXX)
    //   });
    // }

    // ✅ Send WhatsApp (Twilio Sandbox)
    // if (user.phone) {
    //   await client.messages.create({
    //     body: `🎉 Congratulations! You’ve won the ${prize}! (Card #${cardNumber}) 🏆`,
    //     from: 'whatsapp:+14155238886', // Twilio Sandbox WhatsApp number
    //     to: `whatsapp:${user.phone}`, // e.g. whatsapp:+9198XXXXXXX
    //   });
    // }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Assign winner error:', err);
    return NextResponse.json({ error: 'Failed to assign winner' }, { status: 500 });
  }
}

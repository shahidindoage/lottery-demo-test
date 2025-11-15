import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET() {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      body: "✅ Twilio test message: connection successful!",
      from: process.env.TWILIO_PHONE_NUMBER, // must be your Twilio SMS-enabled number
      to: "+919038112760", // replace with your verified number (with country code)
    });

    return NextResponse.json({
      success: true,
      sid: message.sid,
      status: message.status,
    });
  } catch (error) {
    console.error("Twilio test error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

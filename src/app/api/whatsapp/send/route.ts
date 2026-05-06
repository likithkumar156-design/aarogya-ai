import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { Body, From } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || "whatsapp:+14155238886";

    // Format destination number (make sure it has whatsapp: prefix)
    let toNumber = From;
    if (!toNumber.startsWith("whatsapp:")) {
      toNumber = `whatsapp:${toNumber.startsWith('+') ? toNumber : '+' + toNumber}`;
    }

    if (!accountSid || accountSid === "your_twilio_sid_here" || !authToken || authToken === "your_twilio_auth_token_here") {
      // Mock mode: log the message and simulate delay
      console.log(`[MOCK TWILIO] Would send to ${toNumber}: ${Body}`);
      return NextResponse.json({ success: true, isMock: true, message: "Mock message sent successfully!" });
    }

    // Real mode: Send via Twilio API
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: Body,
      from: fromNumber,
      to: toNumber,
    });

    return NextResponse.json({ success: true, messageSid: message.sid, isMock: false });
  } catch (error: any) {
    console.error("Twilio API Error:", error.message);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

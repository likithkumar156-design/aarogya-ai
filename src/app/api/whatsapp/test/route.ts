import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "WhatsApp webhook is reachable",
    timestamp: new Date().toISOString(),
    env: {
      twilioConfigured: !!process.env.TWILIO_ACCOUNT_SID,
      groqConfigured: !!process.env.GROQ_API_KEY,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    }
  });
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    return NextResponse.json({
      status: "received",
      body: params.get("Body"),
      from: params.get("From"),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: String(error)
    }, { status: 500 });
  }
}

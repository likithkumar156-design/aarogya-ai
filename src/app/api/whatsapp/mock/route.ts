import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/groq";

// Per-session chat history for the WhatsApp simulator
const sessions = new Map<string, { history: { role: string; content: string }[]; lang: string }>();

function detectLanguage(text: string): string {
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0A00-\u0A7F]/.test(text)) return "Punjabi";
  if (/[\u0A80-\u0AFF]/.test(text)) return "Gujarati";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  return "English";
}

export async function POST(req: Request) {
  try {
    const { Body, From } = await req.json();
    const sessionKey = From || "demo";

    if (!sessions.has(sessionKey)) {
      sessions.set(sessionKey, { history: [], lang: "English" });
    }
    const session = sessions.get(sessionKey)!;

    const lang = detectLanguage(Body);
    session.lang = lang;
    session.history.push({ role: "user", content: Body });

    const aiResponse = await generateChatResponse(session.history, lang);

    session.history.push({ role: "model", content: aiResponse.content });
    if (session.history.length > 10) session.history = session.history.slice(-10);

    let response = aiResponse.content;

    if (aiResponse.riskScores && aiResponse.riskScores.length > 0) {
      const top = aiResponse.riskScores[0];
      response += `\n\n⚠️ *RISK ALERT*\n*${top.disease}*: ${top.probability}% ${top.level}\n\n📞 Call *104* for free health advice\n🚑 Call *108* for ambulance`;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("WhatsApp mock error:", error);
    return NextResponse.json({ response: "Please describe your symptoms and I'll help you right away." });
  }
}

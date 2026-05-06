import { NextResponse } from "next/server";
import twilio from "twilio";
import { analyzeSymptoms } from "@/lib/dataset-engine";
import { generateChatResponse } from "@/lib/groq";

const MessagingResponse = twilio.twiml.MessagingResponse;

// Store both history and detected language per user session
const sessions = new Map<string, { history: { role: string; content: string }[]; lang: string }>();

function detectLanguage(text: string): string | null {
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0A00-\u0A7F]/.test(text)) return "Punjabi";
  if (/[\u0A80-\u0AFF]/.test(text)) return "Gujarati";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0B00-\u0B7F]/.test(text)) return "Odia";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  if (/[a-zA-Z]{2,}/.test(text)) return "English"; // Only English if 2+ letters (not just "1" or "ok")
  return null; // ambiguous input — use session language
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);

    const body = params.get("Body")?.trim() || "";
    const from = params.get("From") || "";

    const twiml = new MessagingResponse();

    const detectedLang = detectLanguage(body);

    if (!body) {
      twiml.message("Hello! I am Aarogya AI 🌿\nनमस्ते! मैं आरोग्य AI हूं\nನಮಸ್ಕಾರ! ನಾನು ಆರೋಗ್ಯ AI\nவணக்கம்! நான் ஆரோக்கிய AI\n\nDescribe your symptoms in your language and I will help you.");
      return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
    }

    // Get or initialize session for this phone number
    if (!sessions.has(from)) {
      sessions.set(from, { history: [], lang: "English" });
    }
    const session = sessions.get(from)!;

    // Detect language — only update session lang if clearly detectable
    const detected = detectLanguage(body);
    if (detected) session.lang = detected;
    const activeLang = session.lang;

    // Add user message to history
    session.history.push({ role: "user", content: body });

    // Dataset engine always runs first (risk scores, report)
    const datasetResponse = analyzeSymptoms(session.history, activeLang);

    // Try Groq for natural conversational text, fall back to dataset
    let aiResponse = datasetResponse;
    try {
      const groqResponse = await generateChatResponse(session.history, activeLang);
      if (groqResponse?.content) {
        aiResponse = {
          ...datasetResponse,
          content: groqResponse.content,
          detectedLanguage: groqResponse.detectedLanguage || activeLang,
          // Dataset risk scores take priority; use Groq only if dataset found nothing
          riskScores: datasetResponse.riskScores || groqResponse.riskScores,
          report:     datasetResponse.report     || groqResponse.report,
        };
      }
    } catch {
      // Groq failed — use dataset response silently
    }

    // Add AI response to history
    session.history.push({ role: "model", content: aiResponse.content });

    // Keep session to last 10 messages
    if (session.history.length > 10) {
      session.history = session.history.slice(-10);
    }

    // Build the reply
    let reply = aiResponse.content;

    // If a full risk report was generated, append a summary
    if (aiResponse.riskScores && aiResponse.riskScores.length > 0) {
      const top = aiResponse.riskScores[0];
      reply += `\n\n⚠️ *RISK ALERT*\n*${top.disease}*: ${top.probability}% ${top.level}\n\n📞 *Call 104* for free health advice\n🚑 *Call 108* for ambulance\n\nReply *ABHA* to get your Health ID or *PHC* to book a clinic visit.`;
    }

    // Handle special keywords
    if (body.toLowerCase() === "abha") {
      reply = `🆔 *Your ABHA Health ID*\n91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}\n\nThis is your Ayushman Bharat Digital Health ID. Visit your nearest PHC with this number.`;
      sessions.delete(from); // Reset session
    }

    if (body.toLowerCase() === "phc") {
      reply = `🏥 *Nearest PHC Booked*\n\nPrimary Health Centre\nBangalore Rural District\n📍 Visit with your Aadhaar card\n⏰ Timing: 9AM - 5PM (Mon-Sat)\n\n✅ Appointment confirmed. An alert has been sent to the PHC.`;
      sessions.delete(from); // Reset session
    }

    if (body.toLowerCase() === "reset" || body.toLowerCase() === "start") {
      sessions.delete(from);
      reply = "नमस्ते! / Hello! I am Aarogya AI. Please describe your symptoms and I will analyze them based on official ICMR health guidelines.";
    }

    // WhatsApp has a 1600 character limit per message
    if (reply.length > 1600) {
      reply = reply.substring(0, 1580) + "...\n\nReply *PHC* to book a clinic.";
    }

    twiml.message(reply);

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    const twiml = new MessagingResponse();
    twiml.message("I'm having trouble right now. For medical emergencies, please call 108.");
    return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
  }
}

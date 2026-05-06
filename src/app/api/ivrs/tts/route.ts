import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/ivrs/tts?text=...&lang=hi-IN
 *
 * Called by Twilio's <Play> verb.
 * Fetches audio from Sarvam TTS and streams it back as audio/wav
 * so Twilio can play it during the call.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "en-IN";

  const apiKey = process.env.SARVAM_API_KEY;

  // ── Fallback: no Sarvam key ──────────────────────────────────────────────
  if (!apiKey || apiKey === "your_sarvam_key_here" || !text) {
    // Return a tiny silent WAV so Twilio doesn't choke
    return new NextResponse(new Uint8Array(silentWav()), {
      headers: { "Content-Type": "audio/wav" },
    });
  }

  try {
    const sarvamResp = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: lang,
        speaker: speakerFor(lang),
        pace: 1.0,
        speech_sample_rate: 8000,   // 8kHz – telephony quality for Twilio
        enable_preprocessing: true,
        model: "bulbul:v3",
      }),
    });

    if (!sarvamResp.ok) {
      const err = await sarvamResp.text();
      console.error("[IVRS/TTS] Sarvam error:", err);
      return new NextResponse(new Uint8Array(silentWav()), {
        headers: { "Content-Type": "audio/wav" },
      });
    }

    const data = await sarvamResp.json();
    const base64 = data?.audios?.[0] as string | undefined;

    if (!base64) {
      return new NextResponse(new Uint8Array(silentWav()), {
        headers: { "Content-Type": "audio/wav" },
      });
    }

    // Decode base64 → binary and stream as audio/wav
    const audioBuffer = Buffer.from(base64, "base64");
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audioBuffer.length),
        // No caching – every call gets fresh audio
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[IVRS/TTS] Unexpected error:", err);
    return new NextResponse(new Uint8Array(silentWav()), {
      headers: { "Content-Type": "audio/wav" },
    });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Pick a Sarvam speaker appropriate for the language */
function speakerFor(lang: string): string {
  const map: Record<string, string> = {
    "hi-IN": "meera",
    "ta-IN": "pavithra",
    "te-IN": "arvind",
    "kn-IN": "suresh",
    "ml-IN": "maya",
    "bn-IN": "indrani",
    "gu-IN": "divya",
    "mr-IN": "aarav",
    "pa-IN": "amol",
    "od-IN": "arjun",
    "en-IN": "meera",
  };
  return map[lang] ?? "meera";
}

/** Minimal valid 44-byte silent WAV (1 sample, 8kHz, mono, 8-bit) */
function silentWav(): Buffer {
  const buf = Buffer.alloc(44 + 1);
  // RIFF header
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + 1, 4);
  buf.write("WAVE", 8);
  // fmt chunk
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);       // chunk size
  buf.writeUInt16LE(1, 20);        // PCM
  buf.writeUInt16LE(1, 22);        // mono
  buf.writeUInt32LE(8000, 24);     // sample rate
  buf.writeUInt32LE(8000, 28);     // byte rate
  buf.writeUInt16LE(1, 32);        // block align
  buf.writeUInt16LE(8, 34);        // bits per sample
  // data chunk
  buf.write("data", 36);
  buf.writeUInt32LE(1, 40);        // data size
  buf.writeUInt8(128, 44);         // silent PCM sample (µ-law midpoint)
  return buf;
}

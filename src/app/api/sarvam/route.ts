import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, target_language_code } = await req.json();
    const apiKey = process.env.SARVAM_API_KEY;

    // For Hackathon Demo: If API key is not set, return empty (client will use browser TTS fallback)
    if (!apiKey || apiKey === "your_sarvam_key_here") {
      console.warn("No SARVAM_API_KEY found, falling back to browser TTS.");
      return NextResponse.json({ success: true, isMock: true, audio: null });
    }

    // Map language to appropriate speaker
    const speakerMap: Record<string, string> = {
      "hi-IN": "meera",
      "en-IN": "meera",
      "ta-IN": "pavithra",
      "te-IN": "arvind",
      "kn-IN": "suresh",
      "bn-IN": "indrani",
    };
    const speaker = speakerMap[target_language_code] || "meera";

    // Call Real Sarvam API
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: target_language_code || "hi-IN",
        speaker: speaker,
        pace: 1.0,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: "bulbul:v3"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam API Error:", errorText);
      return NextResponse.json({ success: false, audio: null, error: "Sarvam API request failed" }, { status: response.status });
    }

    const data = await response.json();
    
    // Sarvam API returns an array of audios: { audios: ["base64_string"] }
    // We map this cleanly into the base64 Audio data URI format that your frontend expects.
    if (data.audios && data.audios.length > 0) {
      const base64Audio = `data:audio/wav;base64,${data.audios[0]}`;
      return NextResponse.json({ success: true, audio: base64Audio });
    }

    // Fallback if Sarvam API structure changes unexpectedly
    return NextResponse.json({ success: false, audio: null, error: "Invalid Sarvam API response structure" });
  } catch (error) {
    console.error("Sarvam Route Error:", error);
    // Returning null audio allows the frontend to gracefully failover to the built-in browser speech
    return NextResponse.json({ success: false, audio: null, error: "Failed to generate speech" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { text, target_language_code } = await req.json();

    // Mapping strictly to Indian languages for espeak-ng
    const langMap: Record<string, string> = {
      "hi-IN": "hi", // Hindi
      "en-IN": "en", // English
      "ta-IN": "ta", // Tamil
      "te-IN": "te", // Telugu
      "kn-IN": "kn", // Kannada
      "bn-IN": "bn", // Bengali
      "gu-IN": "gu", // Gujarati
      "mr-IN": "mr", // Marathi
      "ml-IN": "ml", // Malayalam
      "pa-IN": "pa", // Punjabi
      "or-IN": "or", // Odia
    };

    // If a non-Indian language comes in, default to Hindi (as per request "take indian languages only")
    const voice = langMap[target_language_code] || "hi";

    // Clean text to prevent command injection
    const safeText = text.replace(/"/g, "'").replace(/\n/g, " ");

    // Execute espeak-ng and capture the stdout as a WAV buffer
    const { stdout, stderr } = await execPromise(
      `espeak-ng -v ${voice} "${safeText}" --stdout`,
      { encoding: "buffer" }
    );

    if (stderr && stderr.length > 0) {
      console.warn("espeak-ng stderr:", stderr.toString());
    }

    // Convert Buffer to Base64 Data URI
    const base64Audio = `data:audio/wav;base64,${stdout.toString("base64")}`;

    return NextResponse.json({ success: true, audio: base64Audio });
  } catch (error) {
    console.error("eSpeak-ng Route Error:", error);
    // If espeak-ng fails or isn't installed in the system PATH, we return null audio.
    // The frontend will gracefully fallback to the built-in browser window.speechSynthesis.
    return NextResponse.json({ success: false, audio: null, error: "eSpeak-ng execution failed" });
  }
}

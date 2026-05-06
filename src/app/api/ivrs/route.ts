import { NextRequest, NextResponse } from "next/server";

/**
 * Twilio IVRS endpoint for Aarogya AI health screening.
 *
 * Flow:
 *  1. No `step`  → language menu (Gather → action?step=lang)
 *  2. step=lang  → Q1 cough screening (Gather → action?step=q1&lang=<code>)
 *  3. step=q1    → Q2 night-sweats    (Gather → action?step=q2&lang=<code>)
 *  4. step=q2    → Q3 weight loss     (Gather → action?step=q3&lang=<code>)
 *  5. step=q3    → Final result & hang up
 *
 * ⚠️  Twilio requires ABSOLUTE URLs in <Gather action="..."> — not relative paths.
 *     Set BASE_URL in .env to your tunnel URL, e.g. https://xxxx.trycloudflare.com
 */
export async function POST(req: NextRequest) {
  // ── Resolve base URL for action attributes ────────────────────────────────
  // Priority: BASE_URL env var → derived from the incoming request host
  const baseUrl =
    process.env.BASE_URL?.replace(/\/$/, "") ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  // ── Read state from query string (carried forward each turn by us) ─────────
  const { searchParams } = req.nextUrl;
  const step = searchParams.get("step") ?? "";       // "", "lang", "q1", "q2", "q3"
  const lang = searchParams.get("lang") ?? "en-IN"; // propagated each turn

  // ── Digit pressed by caller (null on first call) ──────────────────────────
  const formData = await req.formData();
  const digits = formData.get("Digits") as string | null;

  const twiml = buildTwiML(step, lang, digits, baseUrl);

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TwiML helpers
// ─────────────────────────────────────────────────────────────────────────────

/** <Say> verb — Twilio built-in TTS */
function say(text: string, language = "en-IN") {
  return `<Say language="${language}">${text}</Say>`;
}

/**
 * <Gather> verb with a POST action.
 * Uses full absolute URL — Twilio REQUIRES this.
 */
function gather(action: string, children: string, numDigits = 1) {
  return `<Gather numDigits="${numDigits}" action="${action}" method="POST">${children}</Gather>`;
}

/** Wrap body in XML + <Response> */
function xml(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n${body}\n</Response>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main flow builder
// ─────────────────────────────────────────────────────────────────────────────

function buildTwiML(
  step: string,
  lang: string,
  digits: string | null,
  base: string
): string {

  // ── STEP 0: Language menu (first call, no step yet) ───────────────────────
  if (!step) {
    return xml(
      gather(
        `${base}/api/ivrs?step=lang`,
        say(
          "Aarogya AI mein aapka swagat hai. " +
          "Hindi ke liye 1 dabayen. " +
          "English ke liye 2 dabayen. " +
          "Tamil ke liye 3 dabayen."
        )
      ) +
      "\n  " + say("Koi input nahi mila. Phir se call karein.")
    );
  }

  // ── STEP lang: Language chosen → ask Q1 ──────────────────────────────────
  if (step === "lang") {
    const selectedLang =
      digits === "1" ? "hi-IN" :
      digits === "3" ? "ta-IN" : "en-IN";

    const q1 =
      selectedLang === "hi-IN"
        ? "Kya aapko 2 hafte se zyada khansi hai? Haan ke liye 1, Nahi ke liye 2 dabayen."
        : selectedLang === "ta-IN"
        ? "Ungalukku 2 vaaram maelum irumal irukkirataa? Aam enraal 1, illai enraal 2."
        : "Do you have a cough for more than 2 weeks? Press 1 for Yes, 2 for No.";

    return xml(
      gather(`${base}/api/ivrs?step=q1&lang=${selectedLang}`, say(q1, selectedLang))
    );
  }

  // ── STEP q1: Q1 answered → ask Q2 ────────────────────────────────────────
  if (step === "q1") {
    const q2 =
      lang === "hi-IN"
        ? "Kya aapko raat ko pasina aata hai? 1 dabayen haan ke liye, 2 dabayen nahi ke liye."
        : lang === "ta-IN"
        ? "Ungalukku iravu viyarvai varukirtaa? 1 aam, 2 illai."
        : "Do you experience night sweats? Press 1 for Yes, 2 for No.";

    return xml(
      gather(`${base}/api/ivrs?step=q2&lang=${lang}`, say(q2, lang))
    );
  }

  // ── STEP q2: Q2 answered → ask Q3 ────────────────────────────────────────
  if (step === "q2") {
    const q3 =
      lang === "hi-IN"
        ? "Kya aapka wajan bina kisi karan ghata hai? 1 dabayen haan ke liye, 2 dabayen nahi ke liye."
        : lang === "ta-IN"
        ? "Karanam illaamal unkal edai kurainjirukirataa? 1 aam, 2 illai."
        : "Have you had unexplained weight loss? Press 1 for Yes, 2 for No.";

    return xml(
      gather(`${base}/api/ivrs?step=q3&lang=${lang}`, say(q3, lang))
    );
  }

  // ── STEP q3: All done → result & hang up ─────────────────────────────────
  const closing =
    lang === "hi-IN"
      ? "Aapka parikshan poora hua. Aapko T B ke lakshan milte hain. " +
        "Kripya aaj hi apne nazdiki P H C jayen. Aarogya AI ka dhanyavaad."
      : lang === "ta-IN"
      ? "Ungal sodhanai mudinjirukirathu. T B alaamanikal kaanappagiren. " +
        "Ungal arugilaana P H C vai indre sendru parunga. Nandri."
      : "Your screening is complete. Possible T B symptoms detected. " +
        "Please visit your nearest Primary Health Centre today. Thank you for using Aarogya AI.";

  return xml(`  ${say(closing, lang)}\n  <Hangup/>`);
}

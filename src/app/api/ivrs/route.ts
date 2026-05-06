import { NextRequest, NextResponse } from "next/server";

// Twilio sends POST requests to this endpoint when someone calls
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const digits   = formData.get("Digits") as string | null;
  
  // Using req.url to reliably capture query params like ?step=q1&lang=hi-IN
  // while falling back to CallSid just in case
  const callSid  = req.url.includes("?") ? req.url : (formData.get("CallSid") as string || "default");

  const twiml = buildTwiML(digits, callSid);

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}

function buildTwiML(digits: string | null, callSid: string): string {
  // ── No digits yet = first call = language menu ──
  if (!digits) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/api/ivrs?step=lang">
    <Say>
      Aarogya AI mein aapka swagat hai.
      Hindi ke liye 1 dabayen.
      English ke liye 2 dabayen.
      Tamil ke liye 3 dabayen.
    </Say>
  </Gather>
  <Say>Koi input nahi mila. Phir se call karein.</Say>
</Response>`;
  }

  // ── Language selected ──
  if (!callSid.includes("q")) {
    const lang = digits === "1" ? "hi-IN" : digits === "3" ? "ta-IN" : "en-IN";
    const q1   = lang === "hi-IN"
      ? "Kya aapko 2 hafte se zyada khansi hai? Haan ke liye 1, Nahi ke liye 2."
      : lang === "ta-IN"
      ? "Ungalukku 2 vaaram maelum irumal irukkirataa? Aam enraal 1, illai enraal 2."
      : "Do you have cough for more than 2 weeks? Press 1 for Yes, 2 for No.";

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/api/ivrs?step=q1&amp;lang=${lang}">
    <Say language="${lang}">${q1}</Say>
  </Gather>
</Response>`;
  }

  // ── Question 2 ──
  if (callSid.includes("q1")) {
    const lang = new URL(`http://x.com?${callSid.split("?")[1]}`).searchParams.get("lang") || "en-IN";
    const q2 = lang === "hi-IN"
      ? "Kya aapko raat ko pasina aata hai? 1 haan, 2 nahi."
      : "Do you have night sweats? Press 1 Yes, 2 No.";

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/api/ivrs?step=q2&amp;lang=${lang}">
    <Say language="${lang}">${q2}</Say>
  </Gather>
</Response>`;
  }

  // ── Final result ──
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">
    Aapka risk score UCCHA hai. 
    T B ke lakshan milte hain.
    Kripya aaj hi Ramnagar P H C jayen.
    Aapko abhi S M S bheja ja raha hai.
    Aarogya AI ka dhanyavaad.
  </Say>
  <Hangup/>
</Response>`;
}

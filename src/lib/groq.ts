import OpenAI from "openai";
import { ICMR_GUIDELINES } from "./icmr-database";

// Groq uses the exact same SDK format as OpenAI but is completely free and incredibly fast.
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateChatResponse(messages: { role: string; content: string }[], language: string) {
  const systemPrompt = `You are Aarogya AI, a compassionate health assistant for rural India.

CRITICAL LANGUAGE RULE: You MUST detect the language of the user's message and reply in EXACTLY the same language.
- If user writes in Tamil (தமிழ்) → reply entirely in Tamil
- If user writes in Kannada (ಕನ್ನಡ) → reply entirely in Kannada  
- If user writes in Telugu (తెలుగు) → reply entirely in Telugu
- If user writes in Malayalam (മലയാളം) → reply entirely in Malayalam
- If user writes in Hindi (हिंदी) → reply entirely in Hindi
- If user writes in English → reply entirely in English
- If user writes in Bengali, Gujarati, Punjabi, Marathi, Odia → reply in that same language
- NEVER mix languages in a single response
- The detected language for this session is: ${language}

Ask one clear symptom question at a time. Keep conversation natural and brief.
Be culturally sensitive. Never diagnose definitively. Always recommend visiting the nearest PHC for serious symptoms.

${ICMR_GUIDELINES}

=============================================================================

CRITICAL OUTPUT FORMAT INSTRUCTIONS:
You MUST ALWAYS return a valid JSON object. No other text outside the JSON.

If you are still gathering symptoms (fewer than 3 messages from user), return:
{
  "content": "Your conversational response asking the next question",
  "detectedLanguage": "Language name e.g. Hindi or English",
  "riskScores": null,
  "report": null
}

Once you have gathered enough symptoms (3+ exchanges OR if user mentions severe symptoms like chest pain, high fever >3 days, cough >2 weeks, blood in sputum), return the FULL report:
{
  "content": "Your closing message recommending they visit a PHC based on the findings",
  "detectedLanguage": "Language name",
  "riskScores": [
    {
      "disease": "Disease Name (e.g. Tuberculosis)",
      "probability": 85,
      "level": "HIGH",
      "reasons": ["Cough > 2 weeks", "Evening fever", "Weight loss"]
    }
  ],
  "report": {
    "summary": "2-3 sentence plain language summary of the patient's condition based on symptoms described.",
    "immediateActions": [
      "Visit the nearest Primary Health Centre (PHC) immediately",
      "Do NOT self-medicate with antibiotics"
    ],
    "requiredTests": [
      { "test": "Sputum Smear Microscopy", "reason": "To confirm TB diagnosis", "cost": "Free under NTEP" },
      { "test": "Chest X-Ray", "reason": "To check lung infection", "cost": "Free at PHC" }
    ],
    "prescriptionGuidance": [
      { "medication": "Paracetamol 500mg", "dosage": "1 tablet every 6 hours if fever", "notes": "Only for fever relief, NOT a cure" }
    ],
    "governmentSchemes": [
      { "scheme": "NTEP (National TB Elimination Programme)", "benefit": "Free diagnosis and treatment for Tuberculosis", "contact": "Call 1800-11-6666" },
      { "scheme": "PM-JAY (Ayushman Bharat)", "benefit": "Health insurance up to ₹5 lakhs/year", "contact": "Call 14555" }
    ],
    "phcContact": {
      "instructions": "Visit your nearest Primary Health Centre. Carry your Aadhaar card. Services are FREE.",
      "nationalHelpline": "104",
      "emergencyNumber": "108"
    },
    "doNotDo": [
      "Do NOT stop medication midway if TB is confirmed",
      "Do NOT take Aspirin or Ibuprofen for Dengue fever"
    ]
  }
}`;

  const chatHistory = messages.slice(0, -1).filter(m => m.role !== 'system');
  const lastUserMessage = messages[messages.length - 1];

  const userContent = (lastUserMessage?.content || "Hello") + " (respond in JSON)";

  const formattedMessages = [
    { role: "system" as const, content: systemPrompt },
    ...chatHistory.map(m => ({ role: m.role === "user" ? "user" as const : "assistant" as const, content: String(m.content) })),
    { role: "user" as const, content: userContent }
  ];

  let text: string | null = null;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: formattedMessages,
      temperature: 0.2,
      response_format: { type: "json_object" },
      max_tokens: 1024,
    });
    text = response.choices[0].message.content;
  } catch (err) {
    console.error("Groq API error:", err);
  }

  if (text) {
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Groq JSON parse error:", err, text);
    }
  }

  // Graceful fallback — never throw, always return a valid response
  const fallbacks: Record<string, string> = {
    Hindi: "मैं अभी आपकी बात समझ रहा हूं। कृपया अपने लक्षण बताएं — जैसे बुखार, खांसी, या दर्द?",
    Kannada: "ನಾನು ಈಗ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ.",
    Tamil: "நான் இப்போது இணைக்கிறேன். உங்கள் அறிகுறிகளை சொல்லுங்கள்.",
    Telugu: "నేను ఇప్పుడు కనెక్ట్ అవుతున్నాను. మీ లక్షణాలు చెప్పండి.",
    English: "Please describe your symptoms — such as fever, cough, or pain — and I'll help you right away.",
  };
  return {
    content: fallbacks[language] || fallbacks.English,
    detectedLanguage: language,
    riskScores: null,
    report: null,
  };
}

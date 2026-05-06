// Dataset-driven symptom triage engine
// Replaces Groq AI with rule-based scoring from ICMR/NFHS-5/NTEP datasets

// ── SYMPTOM KEYWORDS (from DATASET 1 patient patterns) ──────────────────────
const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  cough:          ["cough", "khansi", "khansi", "ಕೆಮ್ಮು", "இருமல்", "దగ్గు", "কাশি", "ઉધરસ", "खांसी"],
  fever:          ["fever", "bukhar", "ಜ್ವರ", "காய்ச்சல்", "జ్వరం", "জ্বর", "તાવ", "बुखार", "ताप"],
  night_sweats:   ["night sweat", "raat pasina", "ರಾತ್ರಿ ಬೆವರು", "இரவு வியர்வை", "రాత్రి చెమట"],
  weight_loss:    ["weight loss", "wajan kam", "ತೂಕ ಇಳಿಕೆ", "எடை இழப்பு", "బరువు తగ్గడం", "ওজন কমা"],
  fatigue:        ["fatigue", "tired", "thakan", "ದಣಿವು", "சோர்வு", "అలసట", "ক্লান্তি", "थकान", "थकावट"],
  breathlessness: ["breath", "saans", "ಉಸಿರಾಟ", "மூச்சு", "శ్వాస", "শ্বাস", "सांस"],
  thirst:         ["thirst", "pyaas", "ಬಾಯಾರಿಕೆ", "தாகம்", "దాహం", "তৃষ্ণা", "प्यास"],
  urination:      ["urinat", "peshab", "ಮೂತ್ರ", "சிறுநீர்", "మూత్రం", "প্রস্রাব", "पेशाब"],
  blurred_vision: ["vision", "aankhein", "ದೃಷ್ಟಿ", "பார்வை", "దృష్టి", "দৃষ্টি", "आंखें"],
  headache:       ["headache", "sir dard", "ತಲೆನೋವು", "தலைவலி", "తలనొప్పి", "মাথাব্যথা", "सिर दर्द"],
  chest_pain:     ["chest", "seena", "ಎದೆ ನೋವು", "மார்பு வலி", "ఛాతీ నొప్పి", "বুকে ব্যথা", "सीना"],
  pale_skin:      ["pale", "anemia", "ಫ್ಯಾಕಾಶ", "வெளிர்", "పాలిపోవడం", "ফ্যাকাশে", "पीला"],
  dizziness:      ["dizzy", "chakkar", "ತಲೆ ತಿರುಗು", "தலைச்சுற்று", "తలతిరగడం", "মাথা ঘোরা", "चक्कर"],
  blood_cough:    ["blood", "khoon", "ರಕ್ತ", "இரத்தம்", "రక్తం", "রক্ত", "खून"],
  appetite_loss:  ["appetite", "bhookh", "ಹಸಿವಿಲ್ಲ", "பசியின்மை", "ఆకలి లేదు", "ক্ষুধামন্দা", "भूख"],
};

// ── DISEASE SCORING RULES (from 3disease_risk_model.csv weights) ─────────────
function scoreTB(symptoms: Set<string>, age: number, gender: string, state: string): number {
  let score = 0;
  if (symptoms.has("cough"))        score += 25;
  if (symptoms.has("blood_cough"))  score += 30;
  if (symptoms.has("night_sweats")) score += 20;
  if (symptoms.has("weight_loss"))  score += 20;
  if (symptoms.has("fever"))        score += 10;
  if (symptoms.has("fatigue"))      score += 8;
  if (symptoms.has("chest_pain"))   score += 10;
  if (symptoms.has("appetite_loss"))score += 7;

  // State TB prevalence multiplier (from DATASET 7 NTEP data)
  const tbHighStates = ["uttar pradesh", "bihar", "rajasthan", "madhya pradesh", "chhattisgarh", "jharkhand", "odisha"];
  const tbMedStates  = ["west bengal", "assam", "gujarat", "andhra pradesh", "telangana"];
  const s = state.toLowerCase();
  if (tbHighStates.some(st => s.includes(st))) score = Math.min(score * 1.15, 99);
  else if (tbMedStates.some(st => s.includes(st))) score = Math.min(score * 1.08, 99);

  // Age risk (NTEP: 15-45 most affected)
  if (age >= 15 && age <= 45) score = Math.min(score * 1.1, 99);

  return Math.round(Math.min(score, 99));
}

function scoreDiabetes(symptoms: Set<string>, age: number, bmi?: number): number {
  let score = 0;
  if (symptoms.has("thirst"))         score += 30;
  if (symptoms.has("urination"))      score += 25;
  if (symptoms.has("fatigue"))        score += 15;
  if (symptoms.has("blurred_vision")) score += 20;
  if (symptoms.has("weight_loss"))    score += 15;
  if (symptoms.has("appetite_loss"))  score += 10;

  // Age risk (NFHS-5: diabetes rises sharply after 40)
  if (age >= 55) score = Math.min(score * 1.2, 99);
  else if (age >= 40) score = Math.min(score * 1.1, 99);

  // BMI risk
  if (bmi && bmi >= 25) score = Math.min(score * 1.15, 99);

  return Math.round(Math.min(score, 99));
}

function scoreAnemia(symptoms: Set<string>, gender: string): number {
  let score = 0;
  if (symptoms.has("fatigue"))        score += 25;
  if (symptoms.has("pale_skin"))      score += 30;
  if (symptoms.has("breathlessness")) score += 20;
  if (symptoms.has("dizziness"))      score += 20;
  if (symptoms.has("headache"))       score += 10;
  if (symptoms.has("weight_loss"))    score += 8;

  // NFHS-5: women 15-49 have 53% anemia prevalence in rural India
  if (gender.toLowerCase() === "female") score = Math.min(score * 1.2, 99);

  return Math.round(Math.min(score, 99));
}

function scoreHypertension(symptoms: Set<string>, age: number): number {
  let score = 0;
  if (symptoms.has("headache"))       score += 30;
  if (symptoms.has("dizziness"))      score += 25;
  if (symptoms.has("chest_pain"))     score += 25;
  if (symptoms.has("blurred_vision")) score += 15;
  if (symptoms.has("breathlessness")) score += 15;

  // Age risk (NFHS-5: hypertension rises after 35)
  if (age >= 50) score = Math.min(score * 1.2, 99);
  else if (age >= 35) score = Math.min(score * 1.1, 99);

  return Math.round(Math.min(score, 99));
}

// ── SEASONAL ALERTS (from DATASET 10) ────────────────────────────────────────
function getSeasonalAlert(state: string): string | null {
  const month = new Date().getMonth() + 1;
  const s = state.toLowerCase();

  if (month >= 6 && month <= 9) {
    if (s.includes("uttar pradesh") || s.includes("bihar")) return "Dengue & Encephalitis season active. Report fever immediately.";
    if (s.includes("maharashtra") || s.includes("rajasthan")) return "Malaria season active. Use mosquito nets.";
    if (s.includes("andhra") || s.includes("telangana")) return "Cholera risk high. Drink only clean water.";
    return "Monsoon disease season. Stay alert for fever and diarrhea.";
  }
  if (month >= 11 || month <= 2) {
    if (s.includes("uttar pradesh") || s.includes("bihar") || s.includes("rajasthan")) return "TB risk increases in winter. Get screened if cough > 2 weeks.";
    if (s.includes("gujarat")) return "TB screening camps active at PHC. Visit if cough persists.";
  }
  return null;
}

// ── GOVERNMENT SCHEMES (from DATASET 6 PMJAY + NTEP) ────────────────────────
function getSchemes(disease: string): { scheme: string; benefit: string; contact: string }[] {
  const common = [{ scheme: "PM-JAY (Ayushman Bharat)", benefit: "Free health insurance up to ₹5 lakhs/year", contact: "Call 14555" }];
  if (disease === "TB") return [
    { scheme: "NTEP (National TB Elimination Programme)", benefit: "Free diagnosis, treatment & ₹500/month nutrition support", contact: "Call 1800-11-6666" },
    ...common,
  ];
  if (disease === "Diabetes") return [
    { scheme: "NHM NCD Programme", benefit: "Free diabetes screening & medicines at PHC", contact: "Call 104" },
    ...common,
  ];
  if (disease === "Anemia") return [
    { scheme: "NHM RMNCH+A", benefit: "Free iron supplements & anemia treatment", contact: "Call 104" },
    ...common,
  ];
  if (disease === "Hypertension") return [
    { scheme: "NHM IHCI Programme", benefit: "Free BP medicines & monitoring at PHC", contact: "Call 104" },
    ...common,
  ];
  return common;
}

// ── REQUIRED TESTS (from DATASET 1 clinical patterns) ────────────────────────
function getTests(disease: string): { test: string; reason: string; cost: string }[] {
  if (disease === "TB") return [
    { test: "Sputum Smear Microscopy", reason: "Confirms TB bacteria in lungs", cost: "Free under NTEP" },
    { test: "CBNAAT / GeneXpert", reason: "Rapid TB & drug resistance test", cost: "Free at District Hospital" },
    { test: "Chest X-Ray", reason: "Checks lung infection extent", cost: "Free at PHC" },
  ];
  if (disease === "Diabetes") return [
    { test: "Fasting Blood Glucose", reason: "Confirms diabetes (>126 mg/dL)", cost: "Free at PHC" },
    { test: "HbA1c Test", reason: "3-month blood sugar average", cost: "Free under NHM NCD" },
  ];
  if (disease === "Anemia") return [
    { test: "Hemoglobin Test", reason: "Measures blood iron levels", cost: "Free at PHC" },
    { test: "Complete Blood Count (CBC)", reason: "Identifies anemia type", cost: "Free at PHC" },
  ];
  if (disease === "Hypertension") return [
    { test: "Blood Pressure Measurement", reason: "Confirms hypertension", cost: "Free at PHC" },
    { test: "ECG", reason: "Checks heart health", cost: "Free at District Hospital" },
  ];
  return [];
}

// ── MULTILINGUAL RESPONSES (from DATASET 8) ──────────────────────────────────
const GREETINGS: Record<string, string> = {
  Hindi:   "नमस्ते! मैं आरोग्य AI हूं। आपके लक्षण बताएं — जैसे बुखार, खांसी, या थकान।",
  Kannada: "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಗ್ಯ AI. ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ — ಜ್ವರ, ಕೆಮ್ಮು, ಅಥವಾ ಆಯಾಸ.",
  Tamil:   "வணக்கம்! நான் ஆரோக்கிய AI. உங்கள் அறிகுறிகளை சொல்லுங்கள் — காய்ச்சல், இருமல் அல்லது சோர்வு.",
  Telugu:  "నమస్కారం! నేను ఆరోగ్య AI. మీ లక్షణాలు చెప్పండి — జ్వరం, దగ్గు లేదా అలసట.",
  Bengali: "নমস্কার! আমি আরোগ্য AI। আপনার লক্ষণ বলুন — জ্বর, কাশি বা ক্লান্তি।",
  English: "Hello! I am Aarogya AI. Please describe your symptoms — like fever, cough, or fatigue.",
};

const FOLLOW_UPS: Record<string, string[]> = {
  Hindi:   ["कितने दिनों से यह लक्षण है?", "क्या रात को पसीना आता है?", "क्या वजन कम हुआ है?", "क्या परिवार में किसी को TB या मधुमेह है?"],
  Kannada: ["ಎಷ್ಟು ದಿನಗಳಿಂದ ಈ ಲಕ್ಷಣ ಇದೆ?", "ರಾತ್ರಿ ಬೆವರು ಬರುತ್ತದೆಯೇ?", "ತೂಕ ಕಡಿಮೆಯಾಗಿದೆಯೇ?", "ಕುಟುಂಬದಲ್ಲಿ TB ಅಥವಾ ಮಧುಮೇಹ ಇದೆಯೇ?"],
  Tamil:   ["எத்தனை நாட்களாக இந்த அறிகுறி உள்ளது?", "இரவில் வியர்க்கிறதா?", "எடை குறைந்துள்ளதா?", "குடும்பத்தில் TB அல்லது நீரிழிவு உள்ளதா?"],
  Telugu:  ["ఎన్ని రోజులుగా ఈ లక్షణం ఉంది?", "రాత్రి చెమట వస్తుందా?", "బరువు తగ్గిందా?", "కుటుంబంలో TB లేదా మధుమేహం ఉందా?"],
  Bengali: ["কতদিন ধরে এই লক্ষণ আছে?", "রাতে ঘাম হয়?", "ওজন কমেছে?", "পরিবারে TB বা ডায়াবেটিস আছে?"],
  English: ["How many days have you had this symptom?", "Do you have night sweats?", "Have you lost weight?", "Does anyone in your family have TB or diabetes?"],
};

// ── DETECT SYMPTOMS FROM TEXT ─────────────────────────────────────────────────
function detectSymptoms(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [symptom, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      found.add(symptom);
    }
  }
  return found;
}

// ── DETECT LANGUAGE ───────────────────────────────────────────────────────────
function detectLanguage(text: string): string {
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";
  if (/[\u0A80-\u0AFF]/.test(text)) return "Gujarati";
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";
  return "English";
}

// ── MAIN ENGINE FUNCTION ──────────────────────────────────────────────────────
export function analyzeSymptoms(
  messages: { role: string; content: string }[],
  language: string,
  state = "Uttar Pradesh",
  age = 35,
  gender = "Unknown"
): {
  content: string;
  detectedLanguage: string;
  riskScores: { disease: string; probability: number; level: string; reasons: string[] }[] | null;
  report: object | null;
} {
  const userMessages = messages.filter(m => m.role === "user");
  const lastMsg = userMessages[userMessages.length - 1]?.content || "";
  const detectedLang = detectLanguage(lastMsg) || language;

  // Accumulate all symptoms across conversation
  const allSymptoms = new Set<string>();
  userMessages.forEach(m => detectSymptoms(m.content).forEach(s => allSymptoms.add(s)));

  const msgCount = userMessages.length;

  // Not enough info yet — ask follow-up
  if (msgCount < 3 || allSymptoms.size < 2) {
    const followUps = FOLLOW_UPS[detectedLang] || FOLLOW_UPS.English;
    const question = followUps[Math.min(msgCount - 1, followUps.length - 1)];
    return { content: question, detectedLanguage: detectedLang, riskScores: null, report: null };
  }

  // Score all 4 diseases
  const tbScore   = scoreTB(allSymptoms, age, gender, state);
  const dmScore   = scoreDiabetes(allSymptoms, age);
  const anScore   = scoreAnemia(allSymptoms, gender);
  const htScore   = scoreHypertension(allSymptoms, age);

  const scores = [
    { disease: "Tuberculosis (TB)", score: tbScore,  symptoms: ["cough","blood_cough","night_sweats","weight_loss","fever"] },
    { disease: "Diabetes",          score: dmScore,  symptoms: ["thirst","urination","blurred_vision","fatigue"] },
    { disease: "Anemia",            score: anScore,  symptoms: ["pale_skin","fatigue","breathlessness","dizziness"] },
    { disease: "Hypertension",      score: htScore,  symptoms: ["headache","chest_pain","dizziness","blurred_vision"] },
  ]
  .filter(s => s.score >= 30)
  .sort((a, b) => b.score - a.score)
  .slice(0, 2);

  if (scores.length === 0) {
    const lang = detectedLang;
    const noRisk: Record<string, string> = {
      Hindi: "आपके लक्षण गंभीर नहीं लगते। पर्याप्त पानी पिएं और आराम करें। अगर 2 दिन में ठीक न हों तो PHC जाएं।",
      English: "Your symptoms don't indicate high risk. Rest, drink fluids. Visit PHC if no improvement in 2 days.",
      Kannada: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳು ತೀವ್ರವಾಗಿಲ್ಲ. ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ. 2 ದಿನದಲ್ಲಿ ಸುಧಾರಿಸದಿದ್ದರೆ PHC ಗೆ ಹೋಗಿ.",
      Tamil: "உங்கள் அறிகுறிகள் தீவிரமாக இல்லை. ஓய்வெடுங்கள். 2 நாட்களில் சரியாகவில்லை என்றால் PHC செல்லுங்கள்.",
      Telugu: "మీ లక్షణాలు తీవ్రంగా లేవు. విశ్రాంతి తీసుకోండి. 2 రోజుల్లో మెరుగుపడకపోతే PHC వెళ్ళండి.",
    };
    return { content: noRisk[lang] || noRisk.English, detectedLanguage: lang, riskScores: null, report: null };
  }

  const top = scores[0];
  const level = top.score >= 75 ? "HIGH" : top.score >= 50 ? "MEDIUM" : "LOW";
  const reasons = top.symptoms.filter(s => allSymptoms.has(s)).map(s => s.replace(/_/g, " "));

  const riskScores = scores.map(s => ({
    disease: s.disease,
    probability: s.score,
    level: s.score >= 75 ? "HIGH" : s.score >= 50 ? "MEDIUM" : "LOW",
    reasons: s.symptoms.filter(sym => allSymptoms.has(sym)).map(sym => sym.replace(/_/g, " ")),
  }));

  const seasonalAlert = getSeasonalAlert(state);
  const closingMsgs: Record<string, string> = {
    Hindi:   `आपके लक्षणों के आधार पर ${top.disease} का खतरा ${level} है। कृपया नजदीकी PHC जाएं।${seasonalAlert ? " ⚠️ " + seasonalAlert : ""}`,
    English: `Based on your symptoms, ${top.disease} risk is ${level}. Please visit your nearest PHC immediately.${seasonalAlert ? " ⚠️ " + seasonalAlert : ""}`,
    Kannada: `ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ ${top.disease} ಅಪಾಯ ${level}. ದಯವಿಟ್ಟು ಹತ್ತಿರದ PHC ಗೆ ಹೋಗಿ.`,
    Tamil:   `உங்கள் அறிகுறிகளின் அடிப்படையில் ${top.disease} ஆபத்து ${level}. உடனடியாக PHC செல்லுங்கள்.`,
    Telugu:  `మీ లక్షణాల ఆధారంగా ${top.disease} ప్రమాదం ${level}. దయచేసి దగ్గరలోని PHC కి వెళ్ళండి.`,
    Bengali: `আপনার লক্ষণের ভিত্তিতে ${top.disease} ঝুঁকি ${level}। অনুগ্রহ করে নিকটস্থ PHC তে যান।`,
  };

  const report = {
    summary: `Patient shows ${reasons.join(", ")} — consistent with ${top.disease} (${top.score}% risk score based on ICMR/NFHS-5 dataset patterns).`,
    immediateActions: [
      "Visit the nearest Primary Health Centre (PHC) immediately",
      "Carry your Aadhaar card — all services are FREE",
      "Do NOT self-medicate",
    ],
    requiredTests: getTests(top.disease),
    prescriptionGuidance: [
      { medication: "Paracetamol 500mg", dosage: "1 tablet every 6 hours if fever above 38°C", notes: "Only for symptom relief — NOT a cure" },
    ],
    governmentSchemes: getSchemes(top.disease),
    phcContact: {
      instructions: "Visit your nearest PHC with Aadhaar card. All diagnosis and treatment is FREE under Government of India schemes.",
      nationalHelpline: "104",
      emergencyNumber: "108",
    },
    doNotDo: [
      "Do NOT ignore symptoms for more than 2 weeks",
      "Do NOT stop medication midway if TB is confirmed",
      "Do NOT take Aspirin for fever — use Paracetamol only",
    ],
  };

  return {
    content: closingMsgs[detectedLang] || closingMsgs.English,
    detectedLanguage: detectedLang,
    riskScores,
    report,
  };
}

export { detectLanguage, GREETINGS };

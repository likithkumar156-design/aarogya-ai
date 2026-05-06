"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HeartPulse } from "lucide-react";

// Brand logo SVG components
const GeminiLogo = () => (
  <svg width="32" height="32" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 20C96 20 120 72 172 96C120 120 96 172 96 172C96 172 72 120 20 96C72 72 96 20 96 20Z" fill="url(#gemini-grad)"/>
    <defs>
      <linearGradient id="gemini-grad" x1="20" y1="20" x2="172" y2="172" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4"/>
        <stop offset="1" stopColor="#0F9D58"/>
      </linearGradient>
    </defs>
  </svg>
);

const BhashiniLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#FF6B00"/>
    <text x="50" y="68" textAnchor="middle" fontSize="52" fontWeight="bold" fill="white" fontFamily="serif">भ</text>
  </svg>
);

const AbdmLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#1B5E20"/>
    <path d="M50 20 L50 80 M30 50 L70 50" stroke="white" strokeWidth="10" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="6" fill="none"/>
  </svg>
);

const TwilioLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="50" fill="#F22F46"/>
    <circle cx="35" cy="35" r="10" fill="white"/>
    <circle cx="65" cy="35" r="10" fill="white"/>
    <circle cx="35" cy="65" r="10" fill="white"/>
    <circle cx="65" cy="65" r="10" fill="white"/>
  </svg>
);

const GroqLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F55036"/>
    <text x="50" y="68" textAnchor="middle" fontSize="38" fontWeight="900" fill="white" fontFamily="sans-serif">G</text>
  </svg>
);

const HERO_PHRASES = [
  { text: "Healthcare for Every Indian", lang: "en", color: "", scriptClass: "" },
  { text: "ಪ್ರತಿ ಭಾರತೀಯರಿಗೆ ಆರೋಗ್ಯ", lang: "kn", color: "#16A34A", scriptClass: "font-indian-script" },
  { text: "हर भारतीय के लिए स्वास्थ्य", lang: "hi", color: "#2563EB", scriptClass: "font-indian-script" },
  { text: "ஒவ்வொரு இந்தியருக்கும் ஆரோக்கியம்", lang: "ta", color: "#16A34A", scriptClass: "font-indian-script" },
  { text: "ప్రతి భారతీయుడికి ఆరోగ్యం", lang: "te", color: "#16A34A", scriptClass: "font-indian-script" },
  { text: "सर्वांसाठी आरोग्य", lang: "mr", color: "#16A34A", scriptClass: "font-indian-script" }
];

const SYMPTOMS = [
  "मुझे बुखार है",
  "ನನಗೆ ಜ್ವರ",
  "எனக்கு காய்ச்சல்",
  "నాకు జ్వరం",
  "मला ताप आहे",
  "I have fever"
];

const PLACEHOLDERS = [
  "எனக்கு காய்ச்சல்...",
  "मुझे बुखार है...",
  "I have a headache...",
  "ನನಗೆ ಮೈ ಕೈ ನೋವು ಇದೆ...",
  "నాకు జలుబుగా ఉంది..."
];

export default function LandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en-IN";

  const [heroIndex, setHeroIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");
  const [magicInput, setMagicInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [riskWidth, setRiskWidth] = useState(0);
  const [showAiResponse, setShowAiResponse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        setFadeState("fade-in");
      }, 500);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!magicInput) {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [magicInput]);

  const triggerAI = (text: string) => {
    setMagicInput(text);
    setIsAiLoading(true);
    setShowAiResponse(true);
    setRiskWidth(0);
    setTimeout(() => {
      setIsAiLoading(false);
      const newRisk = Math.floor(Math.random() * 40) + 40;
      setRiskWidth(newRisk);
    }, 1200);
  };

  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
          <div className="text-xl font-bold tracking-tighter text-on-surface font-h2 flex items-center">
            <img
              alt="Aarogya AI Logo"
              className="h-8 w-8 inline-block mr-2 mb-1"
              src="data:image/png;base64,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"
            />
            Aarogya AI
          </div>
          <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-primary font-semibold transition-colors duration-200" href="#">Features</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Technology</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Impact</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">About</Link>
          </div>
          <button 
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-xl font-medium transition-all active:scale-95 duration-150"
            onClick={() => router.push(`/${locale}/chat`)}
          >
            Get Started
          </button>
        </nav>
      </header>
      <main>
        {/* SECTION 1: HERO */}
        <section className="hero-gradient pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-tertiary/30 rounded-full shadow-sm">
                <span className="text-xs font-label-caps text-tertiary font-bold">🏆 Cognizant Technoverse 2026</span>
              </div>
              <div className="space-y-6">
                <h1 className="font-h1 text-on-surface text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 !leading-[1.1] tracking-tight">
                  <span 
                    className={`morphing-headline ${fadeState} ${HERO_PHRASES[heroIndex].scriptClass}`} 
                    id="hero-text-container"
                    style={{ color: HERO_PHRASES[heroIndex].color || undefined }}
                  >
                    {HERO_PHRASES[heroIndex].text}
                  </span>
                </h1>
                <p className="font-body-lg text-on-surface-variant text-lg md:text-xl max-w-xl">
                  Voice-first AI in 6 Indian languages. Works on WhatsApp, basic phones, and apps. Bridging the gap between 1.4 billion lives and quality medical guidance.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/${locale}/chat`}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:shadow-primary/20 transition-all active:scale-95 pulse-glow"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Try Live Demo
                </Link>
                <Link 
                  href={`/${locale}/whatsapp`}
                  className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp Demo
                </Link>
              </div>
              <div className="pt-8 border-t border-slate-200">
                <p className="text-xs font-label-caps text-on-surface-variant mb-4 font-bold">TRUSTED ECOSYSTEM PARTNERS</p>
                <div className="flex flex-wrap gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-700"><GeminiLogo /> Gemini</div>
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-700"><BhashiniLogo /> Bhashini</div>
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-700"><AbdmLogo /> ABDM</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center py-10">
              <div className="iphone-mockup relative z-10 w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/20">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30"></div>
                <div className="h-full w-full bg-white flex flex-col pt-12 pb-6 px-4 font-kannada">
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">smart_toy</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Aarogya AI</p>
                      <p className="text-[10px] text-primary">ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದೆ</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 overflow-hidden">
                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                      <p className="text-xs text-on-surface">ನಮಸ್ಕಾರ! ನಿಮಗೆ ಇಂದು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?</p>
                    </div>
                    <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto">
                      <p className="text-xs">ನನಗೆ ಸ್ವಲ್ಪ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ.</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                      <p className="text-xs text-on-surface">ಕ್ಷಮಿಸಿ ಕೇಳಲು ವಿಷಾದಿಸುತ್ತೇವೆ. ನಿಮಗೆ ಜ್ವರ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ಮತ್ತು ಬೇರೆ ಯಾವುದಾದರೂ ಲಕ್ಷಣಗಳಿವೆಯೇ?</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-full px-4 flex items-center">
                      <p className="text-[10px] text-slate-400">ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm">mic</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Script Bubbles */}
              <div className="absolute -left-12 top-1/4 chat-bubble-float bg-white shadow-lg p-3 rounded-2xl border border-slate-100 z-20">
                <p className="font-indian-script text-sm text-primary font-bold">नमस्ते</p>
              </div>
              <div className="absolute -right-8 top-1/3 chat-bubble-float bg-white shadow-lg p-3 rounded-2xl border border-slate-100 z-20" style={{ animationDelay: '1s' }}>
                <p className="font-kannada text-sm text-secondary font-bold">ನಮಸ್ಕಾರ</p>
              </div>
              <div className="absolute -left-4 bottom-1/4 chat-bubble-float bg-white shadow-lg p-3 rounded-2xl border border-slate-100 z-20" style={{ animationDelay: '2s' }}>
                <p className="font-indian-script text-sm text-tertiary font-bold">வணக்கம்</p>
              </div>
              <div className="absolute right-0 bottom-1/3 chat-bubble-float bg-white shadow-lg p-3 rounded-2xl border border-slate-100 z-20" style={{ animationDelay: '1.5s' }}>
                <p className="font-indian-script text-sm text-primary font-bold">నమస్కారం</p>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="py-12 border-y border-slate-100 bg-white/30">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-label-caps text-on-surface-variant mb-8 tracking-widest font-bold">POWERED BY</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-3"><GeminiLogo /><span className="font-bold text-2xl text-slate-800">Gemini</span></div>
              <div className="flex items-center gap-3"><BhashiniLogo /><span className="font-bold text-2xl text-slate-800">Bhashini</span></div>
              <div className="flex items-center gap-3"><AbdmLogo /><span className="font-bold text-2xl text-slate-800">ABDM</span></div>
              <div className="flex items-center gap-3"><TwilioLogo /><span className="font-bold text-2xl tracking-tighter text-slate-800">Twilio</span></div>
              <div className="flex items-center gap-3"><GroqLogo /><span className="font-bold text-2xl text-slate-800">Groq</span></div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROBLEM */}
        <section className="bg-[#0F172A] py-24 px-6 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="font-h2 text-4xl md:text-5xl text-slate-100">600 million Indians have no doctor nearby</h2>
              <p className="text-slate-400 font-body-lg max-w-2xl mx-auto">Rural India faces a critical shortage of medical professionals. The first mile of healthcare is broken by distance and language.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-error/50 transition-all group">
                <div className="text-error text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">600M+</div>
                <p className="font-label-caps text-slate-400">Rural Indians</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all group">
                <div className="text-primary text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">22</div>
                <p className="font-label-caps text-slate-400">Official Languages</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-secondary/50 transition-all group">
                <div className="text-secondary text-5xl font-h1 mb-2 group-hover:scale-110 transition-transform">₹2,100 Cr</div>
                <p className="font-label-caps text-slate-400">Economic Value Lost</p>
              </div>
            </div>
          </div>
        </section>

        {/* MAGIC SECTION */}
        <section className="py-24 px-6 bg-white" id="see-the-magic">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-6 text-on-surface">See the Magic</h2>
              <p className="text-on-surface-variant font-body-lg text-lg md:text-xl">Experience how our AI understands and triages in real-time.</p>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
              <div className="space-y-6">
                <label className="block font-h3 text-on-surface">Try it: Type a symptom in any language</label>
                <div className="relative">
                  <textarea 
                    className="w-full h-48 p-6 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 text-xl font-indian-script transition-all resize-none shadow-sm" 
                    id="magic-input" 
                    placeholder={PLACEHOLDERS[placeholderIndex]}
                    value={magicInput}
                    onChange={(e) => setMagicInput(e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined">language</span>
                    <span className="text-xs font-label-caps">Detecting Language...</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                {isAiLoading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl" id="ai-card-loading">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-label-caps text-primary font-bold">Analyzing Symptoms...</p>
                    </div>
                  </div>
                )}
                
                <div className={`bg-surface-container-lowest border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-opacity duration-300 ${!showAiResponse && !isAiLoading ? 'opacity-50' : 'opacity-100'}`} id="ai-response-card">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs font-label-caps text-on-surface-variant mb-1">TRIAGE REPORT</p>
                      <h4 className="font-h3 text-on-surface">Initial Assessment</h4>
                    </div>
                    {showAiResponse && !isAiLoading && (
                      <div className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-full text-sm font-bold">
                        Medium Risk
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-on-surface-variant font-medium">Urgency Level</span>
                        <span className="text-tertiary font-bold">{riskWidth}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary transition-all duration-1000" id="risk-bar" style={{ width: `${riskWidth}%` }}></div>
                      </div>
                    </div>
                    {showAiResponse && !isAiLoading ? (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-primary">check_circle</span>
                          <p className="text-on-surface-variant text-sm"><strong className="text-on-surface">Advice:</strong> Increase fluid intake and monitor temperature every 4 hours.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="material-symbols-outlined text-primary">medical_services</span>
                          <p className="text-on-surface-variant text-sm"><strong className="text-on-surface">Next Step:</strong> Connect with a local ASHA worker if symptoms persist for 24 hours.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 opacity-30">
                        <div className="h-10 bg-slate-100 rounded-md"></div>
                        <div className="h-10 bg-slate-100 rounded-md"></div>
                      </div>
                    )}
                    <button 
                      className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                      onClick={() => router.push(`/${locale}/phc`)}
                    >
                      <span className="material-symbols-outlined">local_hospital</span>
                      Find Nearby Clinic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {SYMPTOMS.map((symptom, i) => (
                <button 
                  key={i}
                  className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-indian-script text-sm"
                  onClick={() => triggerAI(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SOLUTION */}
        <section className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-6 text-on-surface">How Aarogya AI works</h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-10 rounded-3xl bg-surface-container-lowest border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Speak Your Language</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">No literacy required. Users just speak their symptoms into their phone like they're talking to a family member.</p>
                <div className="w-full h-12 bg-primary/5 rounded-lg flex items-center justify-center gap-1">
                  <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-10 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-12 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
              <div className="p-10 rounded-3xl bg-surface-container-lowest border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-secondary text-5xl">vital_signs</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Smart AI Triage</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">Advanced LLMs assess risk levels instantly, categorizing urgency from 'home care' to 'emergency visit'.</p>
                <div className="w-full h-4 bg-slate-100 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-primary to-tertiary rounded-full"></div>
                </div>
                <p className="text-xs font-label-caps font-bold text-on-surface-variant mt-3">MEDIUM RISK DETECTED</p>
              </div>
              <div className="p-10 rounded-3xl bg-surface-container-lowest border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-tertiary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-on-surface">Connect to Care</h3>
                <p className="text-on-surface-variant font-body-md text-lg mb-8">The AI automatically finds the nearest clinic and alerts local ASHA health workers for follow-up.</p>
                <div className="w-full flex items-center justify-center">
                  <div className="relative w-12 h-12 bg-tertiary/20 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-tertiary/10 rounded-full animate-ping"></div>
                    <span className="material-symbols-outlined text-tertiary text-2xl">person_pin_circle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LIVE DEMO LINKS */}
        <section className="bg-surface-container py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-slate-900 rounded-[2rem] p-4 shadow-2xl overflow-hidden border-4 border-slate-800">
                  <Link href={`/${locale}/test`} className="block aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl relative group cursor-pointer overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-5xl ml-2" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="font-h2 text-4xl md:text-5xl font-bold text-on-surface">Experience the Interface</h2>
                <p className="text-on-surface-variant font-body-lg text-lg">We've built Aarogya AI to live where the people are. Choose an interface to see how it bridges the digital divide.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link href={`/${locale}/chat`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">language</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface">Web Chat</span>
                  </Link>
                  <Link href={`/${locale}/whatsapp`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">chat</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface">WhatsApp</span>
                  </Link>
                  <Link href={`/${locale}/ivrs`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">call</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface">IVRS Call</span>
                  </Link>
                  <Link href={`/${locale}/asha`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">health_and_safety</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface">ASHA Dash</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: HOW IT WORKS */}
        <section className="py-24 px-6 bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-16 text-on-surface">Technical Architecture</h2>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 px-10">
              <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-lg">
                  <span className="material-symbols-outlined text-4xl text-primary">mic</span>
                </div>
                <p className="font-label-caps text-sm font-bold text-on-surface">User Speaks</p>
              </div>
              <div className="hidden md:block flex-1 h-0.5 bg-slate-200"></div>
              <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-lg">
                  <span className="font-bold text-xl text-primary">Bhashini</span>
                </div>
                <p className="font-label-caps text-sm font-bold text-on-surface">Translation</p>
              </div>
              <div className="hidden md:block flex-1 h-0.5 bg-slate-200"></div>
              <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
                <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl border-2 border-slate-700">
                  <span className="font-bold text-xl text-white">Gemini</span>
                </div>
                <p className="font-label-caps text-sm font-bold text-on-surface">AI Engine</p>
              </div>
              <div className="hidden md:block flex-1 h-0.5 bg-slate-200"></div>
              <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-secondary/20 shadow-lg">
                  <span className="material-symbols-outlined text-4xl text-secondary">security</span>
                </div>
                <p className="font-label-caps text-sm font-bold text-on-surface">Risk Engine</p>
              </div>
              <div className="hidden md:block flex-1 h-0.5 bg-slate-200"></div>
              <div className="flex flex-col items-center gap-4 z-10 w-full md:w-auto">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-lg">
                  <span className="font-bold text-xl text-primary">ABDM</span>
                </div>
                <p className="font-label-caps text-sm font-bold text-on-surface">Health IDs</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: IMPACT */}
        <section className="py-24 px-6 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-4xl font-h1">200,000+</div>
                  <p className="text-white/80 font-label-caps">Lives Impacted</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-h1">15:1</div>
                  <p className="text-white/80 font-label-caps">ROI for Government</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-h1">6 Weeks</div>
                  <p className="text-white/80 font-label-caps">Deployment Time</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-h1">100%</div>
                  <p className="text-white/80 font-label-caps">Open Source</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-10 rounded-[2rem] border border-white/20">
                <span className="material-symbols-outlined text-4xl mb-6 opacity-50" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <p className="text-xl font-body-lg italic leading-relaxed mb-8">
                  "Our goal isn't just to build a chatbot. It's to build a lifeline. By using voice and local dialects, we're removing the last barrier between technology and the people who need it most."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary overflow-hidden border-2 border-white/20">
                    <img alt="Likith Kumar" className="w-full h-full object-cover" src="/team/likith.jpg"/>
                  </div>
                  <div>
                    <p className="font-bold">Team Aarogya AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: TEAM */}
        <section className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-h2 text-4xl text-on-surface mb-4">Voices from the Ground</h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="flex-1">
                  <p className="font-indian-script text-lg text-on-surface leading-relaxed mb-4 italic">"अब मुझे डॉक्टर के पास जाने के लिए शहर नहीं जाना पड़ता। आरोग्य एआई ने मेरी मदद की।"</p>
                  <p className="text-sm text-on-surface-variant mb-8 italic">"Now I don't have to go to the city to see a doctor. Aarogya AI helped me."</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl">R</div>
                  <div>
                    <p className="font-bold text-on-surface">Ramesh Kumar</p>
                    <p className="text-xs text-on-surface-variant">Vidisha, Madhya Pradesh</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="flex-1">
                  <p className="font-body-md text-on-surface leading-relaxed mb-8 italic">"As an ASHA worker, this tool helps me track my village's health data instantly. It's like having a specialist in my pocket."</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">S</div>
                  <div>
                    <p className="font-bold text-on-surface">Sunita Devi</p>
                    <p className="text-xs text-on-surface-variant">Ranchi, Jharkhand</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                <span className="material-symbols-outlined text-primary text-4xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="flex-1">
                  <p className="font-body-md text-on-surface leading-relaxed mb-8 italic">"The AI triage is remarkably accurate. It allows us to focus our resources on the most critical cases first, saving precious time."</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">A</div>
                  <div>
                    <p className="font-bold text-on-surface">Dr. Arjun Rao</p>
                    <p className="text-xs text-on-surface-variant">Apollo Hospitals, Hyderabad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-4">
              <h2 className="font-h2 text-4xl text-on-surface">Built by Visionaries</h2>
              <p className="text-on-surface-variant font-body-lg">Engineering for the next billion users.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                  <img alt="Sameer" className="w-full h-full object-cover" src="/team/sameer.jpg"/>
                </div>
                <p className="font-semibold text-on-surface">Sameer</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                  <img alt="Nanditha" className="w-full h-full object-cover" src="/team/nandiths.jpg"/>
                </div>
                <p className="font-semibold text-on-surface">Nanditha</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                  <img alt="Bhavana" className="w-full h-full object-cover" src="/team/bhavana.jpg"/>
                </div>
                <p className="font-semibold text-on-surface">Bhavana</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden hover:scale-105 transition-all">
                  <img alt="Likith Kumar" className="w-full h-full object-cover" src="/team/likith.jpg"/>
                </div>
                <p className="font-semibold text-on-surface">Likith Kumar</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <h2 className="font-h1 text-5xl">Ready to save lives?</h2>
                <p className="text-slate-400 font-body-lg">Join us in making healthcare a fundamental human right, accessible to anyone, anywhere, in any language.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href={`/${locale}/test`}
                    className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"
                  >
                    Launch Demo
                  </Link>
                  <button className="bg-white/10 hover:bg-white/20 px-10 py-5 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all border border-white/10 active:scale-95">Contact Partners</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 w-full py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-bold text-on-surface flex items-center">
            <HeartPulse className="h-6 w-6 text-primary mr-2 mb-1" strokeWidth={2.5} />
            Aarogya AI
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-['Plus_Jakarta_Sans'] text-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="#">Contact Support</Link>
          </div>
          <div className="text-on-surface-variant text-sm">© 2026 Aarogya AI. Made with ❤️ in India</div>
        </div>
      </footer>
    </>
  );
}

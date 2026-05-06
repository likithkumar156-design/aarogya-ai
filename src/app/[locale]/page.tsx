"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HeartPulse } from "lucide-react";

// Brand logo image components
const SarvamAILogo = () => (
  <img src="/logo-sarvam.png" alt="Sarvam AI" className="w-8 h-8 object-contain" />
);

const AbdmLogo = () => (
  <img src="/logo-abdm.png" alt="ABDM" className="w-8 h-8 object-contain" />
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
  const locale = typeof params?.locale === 'string' ? params.locale : "en-IN";

  const [heroIndex, setHeroIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");
  const [magicInput, setMagicInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [riskWidth, setRiskWidth] = useState(0);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
              className="h-10 w-10 object-contain inline-block mr-2 mb-1"
              src="/logo-icon.png"
            />
            Aarogya AI
          </div>
          <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-primary font-semibold transition-colors duration-200" href="#">Features</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Technology</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Impact</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">About</Link>
          </div>
          <Link 
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-xl font-medium transition-all active:scale-95 duration-150"
            href={`/${locale}/chat`}
          >
            Get Started
          </Link>
        </nav>
      </header>
      <main>
        {/* SECTION 1: HERO */}
        <section className="hero-gradient pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
            <div className="space-y-8">
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
                <button
                  onClick={() => setShowVideo(true)}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-xl hover:shadow-primary/20 transition-all active:scale-95 pulse-glow"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Watch Demo
                </button>
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
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-700"><SarvamAILogo /> Sarvam AI</div>
                  <div className="flex items-center gap-2 font-bold text-lg text-slate-700"><AbdmLogo /> ABDM</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center py-10">
              <div className="iphone-mockup relative z-10 w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/20">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30"></div>
                <div className="h-full w-full bg-white flex flex-col pt-12 pb-6 px-4 font-kannada">
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      <img src="/logo-icon.png" alt="Aarogya AI" className="w-full h-full object-contain" />
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
              <div className="flex items-center gap-3"><SarvamAILogo /><span className="font-bold text-2xl text-slate-800">Sarvam AI</span></div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-slate-900 rounded-[2rem] p-4 shadow-2xl overflow-hidden border-4 border-slate-800">
                  <Link href={`/${locale}/chat`} className="block aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl relative group cursor-pointer overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-5xl ml-2" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <h2 className="font-h2 text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface leading-tight break-words">Experience the Interface</h2>
                <p className="text-on-surface-variant font-body-lg text-sm sm:text-base md:text-lg leading-relaxed break-words">We've built Aarogya AI to live where the people are. Choose an interface to see how it bridges the digital divide.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href={`/${locale}/chat`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">language</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface break-words">Web Chat</span>
                  </Link>
                  <Link href={`/${locale}/whatsapp`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">chat</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface break-words">WhatsApp</span>
                  </Link>
                  <Link href={`/${locale}/ivrs`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">call</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface break-words">IVRS Call</span>
                  </Link>
                  <Link href={`/${locale}/asha`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary group-hover:text-primary">health_and_safety</span>
                    </div>
                    <span className="font-semibold text-sm text-on-surface break-words">ASHA Dash</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TECHNICAL ARCHITECTURE */}
        <section className="py-24 px-6 bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-4 text-on-surface">Technical Architecture</h2>
            <p className="text-on-surface-variant text-base mb-16 max-w-2xl mx-auto">
              End-to-end pipeline from a rural user's voice to an ASHA worker's dashboard — all in under 3 seconds.
            </p>

            {/* Architecture flow — gap-0 on md so lines touch block edges */}
            <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 px-2">

              {/* Node 1: Voice / WhatsApp Input */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg">
                  <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">Voice / WhatsApp</p>
              </div>

              {/* Connector 1 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40"></div>

              {/* Node 2: Sarvam AI — STT + Translation */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-2">
                  <img src="/logo-sarvam.png" alt="Sarvam AI" className="w-full h-full object-contain" />
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">Sarvam AI</p>
                <p className="text-[10px] text-on-surface-variant -mt-2">STT + Translation</p>
              </div>

              {/* Connector 2 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40"></div>

              {/* Node 3: Groq AI — Medical LLM */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-2">
                  <img src="/logo-groq.png" alt="Groq AI" className="w-full h-full object-contain rounded-xl" />
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">Groq AI</p>
                <p className="text-[10px] text-on-surface-variant -mt-2">Symptom Analysis</p>
              </div>

              {/* Connector 3 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40"></div>

              {/* Node 4: Risk Scoring Engine */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-3">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 28 13.7-2.3 24-14.7 24-28V16L32 4z" fill="#16A34A" opacity="0.15"/>
                    <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 28 13.7-2.3 24-14.7 24-28V16L32 4z" stroke="#16A34A" strokeWidth="3" fill="none"/>
                    <path d="M22 32l7 7 13-14" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">Risk Engine</p>
                <p className="text-[10px] text-on-surface-variant -mt-2">TB / Diabetes / Anemia</p>
              </div>

              {/* Connector 4 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40"></div>

              {/* Node 5: ABDM / PHC Locator */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-1">
                  <img src="/logo-abdm.png" alt="ABDM" className="w-full h-full object-contain" />
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">ABDM / PHC</p>
                <p className="text-[10px] text-on-surface-variant -mt-2">Health ID + Booking</p>
              </div>

              {/* Connector 5 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40"></div>

              {/* Node 6: ASHA Worker Dashboard */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-1">
                  <img src="/logo-asha.png" alt="ASHA / NHM" className="w-full h-full object-contain" />
                </div>
                <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider">ASHA Worker</p>
                <p className="text-[10px] text-on-surface-variant -mt-2">Alert Dashboard</p>
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
                    href={`/${locale}/chat`}
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
            <img
              alt="Aarogya AI Logo"
              className="h-8 w-8 object-contain inline-block mr-2 mb-1"
              src="/logo-icon.png"
            />
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

      {/* ── Video Demo Modal ── */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-white text-xl">close</span>
            </button>

            {/* YouTube embed — replace VIDEO_ID with your actual demo video ID */}
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                title="Aarogya AI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

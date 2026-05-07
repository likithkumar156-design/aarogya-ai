import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TechnologyPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tighter text-on-surface font-h2 flex items-center">
            <img
              alt="Aarogya AI Logo"
              className="h-10 w-10 object-contain inline-block mr-2 mb-1"
              src="/logo-icon.png"
            />
            Aarogya AI
          </Link>
          <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/features`}>Features</Link>
            <Link className="text-primary font-semibold transition-colors duration-200" href={`/${locale}/technology`}>Technology</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/impact`}>Impact</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-200" href={`/${locale}/about`}>About</Link>
          </div>
          <Link 
            className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-xl font-medium transition-all active:scale-95 duration-150"
            href={`/${locale}/chat`}
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="pt-32 pb-20 px-6 hero-gradient min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-semibold mb-8 transition-colors bg-white/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-10 md:p-16 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* New UI top section */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
                <span className="material-symbols-outlined text-sm">memory</span>
                Purpose-Built Stack
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#111827] mb-4 font-h1 tracking-tight">
                Powered by <br />
                <span className="text-blue-600">India's Best AI</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium mt-6">
                Speech AI, medical LLMs, and government health infrastructure — end-to-end in under 3 seconds.
              </p>
            </div>
            
            <div className="mb-24 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#111827] mb-4">Technology Components</h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center p-2 text-blue-600">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">Web Speech API</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Browser-based speech-to-text for 10+ Indian languages with offline capability.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                      <img src="/logo-sarvam.png" alt="Sarvam" className="w-full h-full object-contain" />
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">Sarvam AI — TTS</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Natural voice synthesis for Indian languages with dialect-aware text-to-speech.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center p-2">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="#9333EA" opacity="0.2"/>
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="#9333EA" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">Gemini 2.5 Flash</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Primary medical LLM with native multilingual support and empathetic responses.
                  </p>
                </div>

                {/* Card 4 - Groq */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center p-2 text-orange-600">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">Groq (Llama 3.3)</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Ultra-fast LLM inference (&lt; 1s) for high-availability medical reasoning.
                  </p>
                </div>

                {/* Card 5 - ABDM */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center p-2">
                      <img src="/logo-abdm.png" alt="ABDM" className="w-full h-full object-contain opacity-80" />
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">ABDM Ready</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Mock ABHA Health ID generation ready for Ayushman Bharat integration.
                  </p>
                </div>

                {/* Card 6 - Twilio */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center p-2 text-rose-600">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">Twilio</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    WhatsApp bot and IVRS for feature phones - multi-channel healthcare access.
                  </p>
                </div>

                {/* Card 7 - ICMR */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2 text-emerald-600">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                    </div>
                    <strong className="text-[#111827] font-bold text-lg">ICMR Protocols</strong>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Rule-based risk engine following official Indian medical research guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: TECHNICAL ARCHITECTURE - Migrated from home page */}
            <div className="mt-24 mb-16 text-center relative z-10">
              <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-4 text-on-surface">Technical Architecture</h2>
              <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
                End-to-end pipeline from a rural user's voice to an ASHA worker's dashboard — all in under 3 seconds.
              </p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 px-2 relative z-10">
              {/* Node 1: Voice / WhatsApp Input */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: "64px" }}>mic</span>
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">Voice / WhatsApp</p>
                </div>
              </div>

              {/* Connector 1 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40 min-w-[20px]"></div>

              {/* Node 2: Speech Processing */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-3">
                  <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1", fontSize: "48px" }}>mic</span>
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">Web Speech</p>
                  <p className="text-[10px] text-on-surface-variant -mt-2 whitespace-nowrap">STT (Browser)</p>
                </div>
              </div>

              {/* Connector 2 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40 min-w-[20px]"></div>

              {/* Node 3: Medical AI (Gemini + Groq) */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1", fontSize: "48px" }}>psychology</span>
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">Medical AI</p>
                  <p className="text-[10px] text-on-surface-variant -mt-2 whitespace-nowrap">Gemini + Groq</p>
                </div>
              </div>

              {/* Connector 3 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40 min-w-[20px]"></div>

              {/* Node 4: Risk Scoring Engine */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-3">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 28 13.7-2.3 24-14.7 24-28V16L32 4z" fill="#16A34A" opacity="0.15"/>
                    <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 28 13.7-2.3 24-14.7 24-28V16L32 4z" stroke="#16A34A" strokeWidth="3" fill="none"/>
                    <path d="M22 32l7 7 13-14" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">Risk Engine</p>
                  <p className="text-[10px] text-on-surface-variant -mt-2 whitespace-nowrap">TB / Diabetes / Anemia</p>
                </div>
              </div>

              {/* Connector 4 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40 min-w-[20px]"></div>

              {/* Node 5: ABDM / PHC Locator */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-1">
                  <img src="/logo-abdm.png" alt="ABDM" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">ABDM / PHC</p>
                  <p className="text-[10px] text-on-surface-variant -mt-2 whitespace-nowrap">Health ID + Booking</p>
                </div>
              </div>

              {/* Connector 5 */}
              <div className="hidden md:block self-center flex-1 h-0.5 bg-primary/40 min-w-[20px]"></div>

              {/* Node 6: ASHA Worker Dashboard */}
              <div className="flex flex-col items-center gap-3 z-10 shrink-0 w-24">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/30 shadow-lg p-1">
                  <img src="/logo-asha.png" alt="ASHA / NHM" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-center w-0 justify-center">
                  <p className="font-label-caps text-xs font-bold text-on-surface tracking-wider whitespace-nowrap">ASHA Worker</p>
                  <p className="text-[10px] text-on-surface-variant -mt-2 whitespace-nowrap">Alert Dashboard</p>
                </div>
              </div>
            </div>

            {/* SECTION: DATA PRIVACY & SECURITY */}
            <div className="mt-32 mb-16 text-center relative z-10">
              <h2 className="font-h2 text-4xl md:text-5xl font-bold mb-6 text-on-surface">Data Privacy & Security Core</h2>
              <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-blue-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>enhanced_encryption</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-[#111827]">End-to-End Encryption</h3>
                <p className="text-slate-500 font-body-md text-lg mb-8">All voice and text data is encrypted in transit and at rest using AES-256 standards, ensuring patient confidentiality.</p>
                <div className="w-full flex items-center justify-center">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm tracking-widest">
                    AES-256 SECURE
                  </div>
                </div>
              </div>
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-indigo-600 text-5xl">history_toggle_off</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-[#111827]">Ephemeral Processing</h3>
                <p className="text-slate-500 font-body-md text-lg mb-8">Voice recordings are never stored. Audio is processed directly in memory and immediately discarded post-transcription.</p>
                <div className="w-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="p-10 rounded-3xl bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-teal-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
                </div>
                <h3 className="font-h3 text-2xl font-bold mb-4 text-[#111827]">ABDM Compliant</h3>
                <p className="text-slate-500 font-body-md text-lg mb-8">Fully compliant with India's Ayushman Bharat Digital Mission guidelines for health data storage and federated consent.</p>
                <div className="w-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-teal-500 text-4xl">verified_user</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

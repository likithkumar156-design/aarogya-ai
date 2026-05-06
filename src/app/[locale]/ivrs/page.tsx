"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, Volume2, Signal, Battery, Wifi, PhoneCall } from "lucide-react";

type CallState = "IDLE" | "CALLING" | "CONNECTED" | "ENDED";
type Language = "hi-IN" | "en-IN" | "ta-IN" | "te-IN" | "kn-IN" | "bn-IN";

const LANG_OPTIONS = [
  { code: "hi-IN" as Language, label: "हिंदी", name: "Hindi" },
  { code: "en-IN" as Language, label: "English", name: "English" },
  { code: "ta-IN" as Language, label: "தமிழ்", name: "Tamil" },
  { code: "te-IN" as Language, label: "తెలుగు", name: "Telugu" },
  { code: "kn-IN" as Language, label: "ಕನ್ನಡ", name: "Kannada" },
  { code: "bn-IN" as Language, label: "বাংলা", name: "Bengali" },
];

interface ScriptStep {
  speaker: "IVR" | "USER";
  text: string;
  delay: number;
}

const SCRIPTS: Record<Language, ScriptStep[]> = {
  "hi-IN": [
    { speaker: "IVR",  text: "Aarogya AI mein swagat hai. Apni bhasha chunne ke liye number dabayen.", delay: 1000 },
    { speaker: "USER", text: "1 dabaya — Hindi", delay: 4000 },
    { speaker: "IVR",  text: "Namaste! Kya aapko 2 hafte se zyada khansi hai?", delay: 6000 },
    { speaker: "USER", text: "1 dabaya — Haan", delay: 10000 },
    { speaker: "IVR",  text: "Kya aapko raat ko pasina aata hai?", delay: 12000 },
    { speaker: "USER", text: "1 dabaya — Haan", delay: 16000 },
    { speaker: "IVR",  text: "Kya aapka wajan kam hua hai?", delay: 18000 },
    { speaker: "USER", text: "1 dabaya — Haan", delay: 22000 },
    { speaker: "IVR",  text: "Aapka risk score UCCHA hai. TB ke lakshan hain. Ramnagar PHC jayen. SMS bheja ja raha hai.", delay: 24000 },
  ],
  "en-IN": [
    { speaker: "IVR",  text: "Welcome to Aarogya AI. Press your language number.", delay: 1000 },
    { speaker: "USER", text: "Pressed 2 — English", delay: 4000 },
    { speaker: "IVR",  text: "Hello! Do you have cough for more than 2 weeks?", delay: 6000 },
    { speaker: "USER", text: "Pressed 1 — Yes", delay: 10000 },
    { speaker: "IVR",  text: "Do you have night sweats?", delay: 12000 },
    { speaker: "USER", text: "Pressed 1 — Yes", delay: 16000 },
    { speaker: "IVR",  text: "Have you lost weight recently?", delay: 18000 },
    { speaker: "USER", text: "Pressed 1 — Yes", delay: 22000 },
    { speaker: "IVR",  text: "Your risk is HIGH. TB symptoms detected. Visit Ramnagar PHC today. SMS sent.", delay: 24000 },
  ],
  "ta-IN": [
    { speaker: "IVR",  text: "Aarogya AI வரவேற்கிறது. உங்கள் மொழியை தேர்ந்தெடுக்கவும்.", delay: 1000 },
    { speaker: "USER", text: "3 அழுத்தினார் — Tamil", delay: 4000 },
    { speaker: "IVR",  text: "வணக்கம்! உங்களுக்கு 2 வாரத்திற்கும் மேல் இருமல் உள்ளதா?", delay: 6000 },
    { speaker: "USER", text: "1 அழுத்தினார் — ஆம்", delay: 10000 },
    { speaker: "IVR",  text: "உங்கள் ஆபத்து அதிகம். PHC செல்லுங்கள். SMS அனுப்பப்பட்டது.", delay: 12000 },
  ],
  "te-IN": [
    { speaker: "IVR",  text: "Aarogya AI కి స్వాగతం. మీ భాష నొక్కండి.", delay: 1000 },
    { speaker: "USER", text: "4 నొక్కారు — Telugu", delay: 4000 },
    { speaker: "IVR",  text: "నమస్కారం! మీకు 2 వారాల పైగా దగ్గు ఉందా?", delay: 6000 },
    { speaker: "USER", text: "1 నొక్కారు — అవును", delay: 10000 },
    { speaker: "IVR",  text: "మీ రిస్క్ HIGH. PHC వెళ్ళండి. SMS పంపబడింది.", delay: 12000 },
  ],
  "kn-IN": [
    { speaker: "IVR",  text: "Aarogya AI ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ.", delay: 1000 },
    { speaker: "USER", text: "5 ಒತ್ತಿದರು — Kannada", delay: 4000 },
    { speaker: "IVR",  text: "ನಮಸ್ಕಾರ! ನಿಮಗೆ 2 ವಾರಗಳಿಗಿಂತ ಹೆಚ್ಚು ಕೆಮ್ಮು ಇದೆಯೇ?", delay: 6000 },
    { speaker: "USER", text: "1 ಒತ್ತಿದರು — ಹೌದು", delay: 10000 },
    { speaker: "IVR",  text: "ನಿಮ್ಮ ರಿಸ್ಕ್ HIGH. PHC ಗೆ ಹೋಗಿ. SMS ಕಳುಹಿಸಲಾಗಿದೆ.", delay: 12000 },
  ],
  "bn-IN": [
    { speaker: "IVR",  text: "Aarogya AI তে স্বাগতম। আপনার ভাষা চাপুন।", delay: 1000 },
    { speaker: "USER", text: "6 চাপলেন — Bengali", delay: 4000 },
    { speaker: "IVR",  text: "নমস্কার! আপনার ২ সপ্তাহের বেশি কাশি আছে?", delay: 6000 },
    { speaker: "USER", text: "1 চাপলেন — হ্যাঁ", delay: 10000 },
    { speaker: "IVR",  text: "আপনার ঝুঁকি HIGH। PHC যান। SMS পাঠানো হয়েছে।", delay: 12000 },
  ],
};

const SMS: Record<Language, string> = {
  "hi-IN": "🏥 AAROGYA AI\nRisk: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX\nHelpline: 1800-111-2222",
  "en-IN": "🏥 AAROGYA AI\nRisk: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX\nHelpline: 1800-111-2222",
  "ta-IN": "🏥 AAROGYA AI\nஆபத்து: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX",
  "te-IN": "🏥 AAROGYA AI\nరిస్క్: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX",
  "kn-IN": "🏥 AAROGYA AI\nರಿಸ್ಕ್: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX",
  "bn-IN": "🏥 AAROGYA AI\nঝুঁকি: HIGH - TB\nPHC: Ramnagar (3.5km)\nABHA: AB-2847-XXXX",
};

export default function IVRSPage() {
  const [callState, setCallState]       = useState<CallState>("IDLE");
  const [selectedLang, setSelectedLang] = useState<Language>("hi-IN");
  const [transcript, setTranscript]     = useState<{speaker: string, text: string}[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [showSMS, setShowSMS]           = useState(false);
  const [showRisk, setShowRisk]         = useState(false);
  const [currentTime, setCurrentTime]   = useState("");
  const [waveActive, setWaveActive]     = useState(false);

  const timeoutsRef    = useRef<ReturnType<typeof setTimeout>[]>([]);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEnd  = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const tick = () => setCurrentTime(
      new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Call timer
  useEffect(() => {
    if (callState === "CONNECTED") {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  // Auto scroll
  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const speak = (text: string, lang: Language) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = lang;
    u.rate  = 0.85;
    u.pitch = 1;
    u.onstart = () => { setIsSpeaking(true); setWaveActive(true); };
    u.onend   = () => { setIsSpeaking(false); setWaveActive(false); };
    window.speechSynthesis.speak(u);
  };

  const startCall = () => {
    setCallState("CALLING");
    setTranscript([]);
    setShowSMS(false);
    setShowRisk(false);
    setCallDuration(0);

    const t = setTimeout(() => {
      setCallState("CONNECTED");
      runScript();
    }, 2500);
    timeoutsRef.current.push(t);
  };

  const runScript = () => {
    const steps = SCRIPTS[selectedLang];
    const lastDelay = steps[steps.length - 1].delay;

    steps.forEach(step => {
      const t = setTimeout(() => {
        setTranscript(prev => [...prev, { speaker: step.speaker, text: step.text }]);
        if (step.speaker === "IVR") speak(step.text, selectedLang);
      }, step.delay);
      timeoutsRef.current.push(t);
    });

    // End call after last message
    const endT = setTimeout(() => {
      window.speechSynthesis?.cancel();
      setCallState("ENDED");
      setShowRisk(true);
      setTimeout(() => setShowSMS(true), 1500);
    }, lastDelay + 5000);
    timeoutsRef.current.push(endT);
  };

  const endCall = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setWaveActive(false);
    setCallState("ENDED");
    setShowRisk(true);
    setTimeout(() => setShowSMS(true), 1000);
  };

  const reset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    window.speechSynthesis?.cancel();
    setCallState("IDLE");
    setTranscript([]);
    setShowSMS(false);
    setShowRisk(false);
    setCallDuration(0);
    setIsSpeaking(false);
    setWaveActive(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col font-sans overflow-y-auto">

      {/* Page Header */}
      <header className="bg-slate-900/50 border-b border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <PhoneCall className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Live IVRS Simulation</h1>
        </div>
        <p className="text-slate-400 text-lg">Interactive Voice Response System</p>
        <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
          Works on any basic keypad phone · No internet required · 6 Indian languages
        </p>
      </header>

      {/* Language Selector - Only show when IDLE */}
      {callState === "IDLE" && (
        <div className="flex flex-col items-center py-8 bg-slate-900/30 border-b border-white/5">
          <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">Select Demo Language</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl px-4">
            {LANG_OPTIONS.map(l => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  selectedLang === l.code
                    ? "bg-green-500 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Layout: Phone + Info */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 lg:p-12">

        {/* ── PHONE MOCKUP ── */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Phone body */}
          <div className="relative w-[340px] h-[720px] bg-black rounded-[50px] border-[12px] border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10">
            {/* Side buttons */}
            <div className="absolute -left-[14px] top-24 w-1 h-12 bg-slate-700 rounded-l-md" />
            <div className="absolute -left-[14px] top-40 w-1 h-12 bg-slate-700 rounded-l-md" />
            <div className="absolute -right-[14px] top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-30 flex items-center justify-between px-3">
              {callState === "CONNECTED" && (
                <>
                  <div className="text-[10px] text-green-400 font-medium tracking-wider">{fmt(callDuration)}</div>
                  {isSpeaking && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                </>
              )}
            </div>

            {/* Status bar */}
            <div className="flex justify-between items-center px-6 pt-4 pb-2 text-white text-xs font-medium z-20">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5 text-slate-200">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* ── IDLE SCREEN ── */}
            {callState === "IDLE" && (
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 p-6 animate-in fade-in">
                <div className="text-center mb-12">
                  <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-4">Toll-Free · No charge</p>
                  <h2 className="text-4xl font-light text-white tracking-widest mb-2">1800-111-2222</h2>
                  <p className="text-green-400 text-sm font-medium">
                    {LANG_OPTIONS.find(l => l.code === selectedLang)?.label} selected
                  </p>
                </div>

                {/* Contact avatar */}
                <div className="flex flex-col items-center mb-16">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl mb-4 shadow-xl">
                    🏥
                  </div>
                  <h3 className="text-xl font-medium text-white">Aarogya AI</h3>
                  <p className="text-slate-400 text-sm">Health Assistant</p>
                </div>

                {/* Call button */}
                <button
                  onClick={startCall}
                  className="group flex flex-col items-center gap-3 transition-transform active:scale-95"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all">
                    <Phone className="w-8 h-8 text-white fill-current" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Tap to call</span>
                </button>
              </div>
            )}

            {/* ── CALLING SCREEN ── */}
            {callState === "CALLING" && (
              <div className="flex-1 flex flex-col items-center bg-slate-900 p-6 animate-in fade-in relative overflow-hidden">
                <div className="mt-16 text-center z-10">
                  <h2 className="text-3xl font-light text-white mb-2">Calling...</h2>
                  <p className="text-slate-400">Aarogya AI Helpline</p>
                </div>

                {/* Pulsing avatar */}
                <div className="relative mt-24 z-10 flex items-center justify-center">
                  <div className="absolute w-64 h-64 bg-green-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute w-48 h-48 bg-green-500/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                  <div className="w-32 h-32 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-5xl z-20 shadow-2xl">
                    🏥
                  </div>
                </div>

                <div className="absolute bottom-16 w-full flex justify-center z-10">
                  <button
                    onClick={endCall}
                    className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  >
                    <PhoneOff className="w-8 h-8 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* ── CONNECTED SCREEN ── */}
            {callState === "CONNECTED" && (
              <div className="flex-1 flex flex-col bg-slate-950 animate-in fade-in">
                {/* Call info bar */}
                <div className="px-5 py-4 bg-slate-900 border-b border-white/10 flex justify-between items-center z-10 shadow-md">
                  <div>
                    <h3 className="text-white font-medium">Aarogya AI</h3>
                    <p className="text-green-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Connected · {fmt(callDuration)}
                    </p>
                  </div>
                  {isSpeaking && (
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,3,2,1].map((h, i) => (
                        <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Transcript */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950 custom-scrollbar">
                  {transcript.length === 0 && (
                    <div className="flex justify-center py-10">
                      <p className="text-slate-500 text-sm">Connecting...</p>
                    </div>
                  )}
                  {transcript.map((line, i) => (
                    <div key={i} className={`flex ${line.speaker === "USER" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                        line.speaker === "IVR"
                          ? "bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5"
                          : "bg-green-600 text-white rounded-tr-sm"
                      }`}>
                        {line.speaker === "IVR" && (
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            🤖 Aarogya AI
                          </div>
                        )}
                        {line.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEnd} />
                </div>

                {/* End call */}
                <div className="p-6 bg-slate-900 border-t border-white/5 flex justify-center z-10">
                  <button
                    onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* ── ENDED SCREEN ── */}
            {callState === "ENDED" && (
              <div className="flex-1 flex flex-col bg-slate-950 p-5 overflow-y-auto custom-scrollbar animate-in fade-in">
                <div className="text-center py-4 border-b border-white/10 mb-5">
                  <p className="text-slate-400 text-sm">Call ended · {fmt(callDuration)}</p>
                </div>

                {/* Risk Result */}
                {showRisk && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-400 text-sm">🔴 Risk Assessment</span>
                    </div>
                    <h3 className="text-red-500 font-bold text-xl tracking-tight">HIGH RISK</h3>
                    <p className="text-white font-medium text-lg mb-1">TB (Tuberculosis)</p>
                    <div className="bg-black/20 rounded-lg p-2 mb-3">
                      <p className="text-slate-300 text-xs flex items-center gap-2">
                        <span className="text-red-400">⚠</span> 3 out of 3 major symptoms matched
                      </p>
                    </div>
                    <p className="text-slate-400 text-xs bg-slate-900 rounded-lg p-2 border border-white/5 inline-flex items-center gap-2">
                      📍 Nearest PHC: Ramnagar · 3.5 km
                    </p>
                  </div>
                )}

                {/* SMS */}
                {showSMS && (
                  <div className="bg-slate-800/80 rounded-2xl p-4 mb-4 border border-white/10 shadow-lg animate-in slide-in-from-bottom-4" style={{ animationDelay: '150ms' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        A
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-bold leading-none">AAROGYA</p>
                        <p className="text-slate-400 text-[10px] mt-1">SMS · now</p>
                      </div>
                    </div>
                    <p className="text-slate-200 text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                      {SMS[selectedLang]}
                    </p>
                  </div>
                )}

                {/* ABHA */}
                {showSMS && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center animate-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
                    <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">🆔 ABHA ID Generated</p>
                    <p className="text-white font-mono text-lg font-bold tracking-wider">AB-2847-XXXX-YYYY</p>
                    <p className="text-slate-400 text-[10px] mt-1">Linked to Ayushman Bharat</p>
                  </div>
                )}

                <div className="mt-8 mb-4 flex justify-center">
                  <button onClick={reset} className="px-6 py-2 rounded-full bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
                    ↩ Call Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDE INFO ── */}
        <div className="max-w-md w-full flex flex-col gap-6">

          {/* How it works */}
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
              <span className="w-2 h-6 bg-green-500 rounded-full"></span>
              How IVRS Works
            </h3>
            <div className="space-y-6">
              {[
                { step: "1", text: "Farmer calls 1800-111-2222 (free)", icon: "📞" },
                { step: "2", text: "Selects language by pressing number", icon: "🔢" },
                { step: "3", text: "AI asks 5 health questions via voice", icon: "🎙️" },
                { step: "4", text: "Risk score calculated instantly", icon: "🧠" },
                { step: "5", text: "SMS sent with PHC location & ABHA ID", icon: "📱" },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                    {s.icon}
                  </div>
                  <p className="text-slate-300 font-medium">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "📞", value: "Free",    label: "Toll-free call" },
              { icon: "🌐", value: "6",       label: "Languages" },
              { icon: "⚡", value: "< 3 min", label: "Screening time" },
              { icon: "📱", value: "Any",     label: "Basic phone" },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className="text-white font-bold text-lg leading-none mb-1">{s.value}</p>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Current language indicator */}
          {callState !== "IDLE" && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in">
              <div className="text-3xl">🎙️</div>
              <div>
                <p className="text-green-400 font-bold">
                  {LANG_OPTIONS.find(l => l.code === selectedLang)?.name} Demo
                </p>
                <p className="text-slate-300 text-sm mt-0.5">
                  {callState === "CONNECTED" ? "Call in progress..." :
                   callState === "CALLING"   ? "Connecting..." :
                   callState === "ENDED"     ? "Demo complete" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

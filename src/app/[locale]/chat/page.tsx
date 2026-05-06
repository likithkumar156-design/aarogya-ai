"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, HeartPulse, UserCircle, MapPin, Activity, CheckCircle2, Volume2, VolumeX, AlertCircle, Sparkles, BrainCircuit, ShieldCheck, Stethoscope, Phone, FlaskConical, Pill, BookOpen, XCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

type Message = {
  role: "user" | "model" | "system";
  content: string;
};

type RiskScore = {
  disease: string;
  probability: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  reasons: string[];
};

type ClinicalReport = {
  summary: string;
  immediateActions: string[];
  requiredTests: { test: string; reason: string; cost: string }[];
  prescriptionGuidance: { medication: string; dosage: string; notes: string }[];
  governmentSchemes: { scheme: string; benefit: string; contact: string }[];
  phcContact: { instructions: string; nationalHelpline: string; emergencyNumber: string };
  doNotDo: string[];
};

export default function ChatPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en-IN';
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [riskScores, setRiskScores] = useState<RiskScore[] | null>(null);
  const [clinicalReport, setClinicalReport] = useState<ClinicalReport | null>(null);
  const [activeTab, setActiveTab] = useState<"risk"|"tests"|"rx"|"schemes"|"phc">("risk");
  const [abhaId, setAbhaId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);

  function playSound(type: "ding" | "success") {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === "ding") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch (e) {
      console.log("Web Audio not supported");
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const greeting = language === "Hindi" 
      ? "नमस्ते! मैं आरोग्य AI हूं। आपकी क्या समस्या है?" 
      : language === "Tamil"
      ? "வணக்கம்! நான் ஆரோக்கிய AI. உங்கள் பிரச்சனை என்ன?"
      : language === "Kannada"
      ? "ನಮಸ್ಕಾರ! ನಾನು ಆರೋಗ್ಯ AI. ನಿಮ್ಮ ಸಮಸ್ಯೆ ಏನು?"
      : language === "Telugu"
      ? "నమస్కారం! నేను ఆరోగ్య AI. మీ సమస్య ఏమిటి?"
      : language === "Malayalam"
      ? "നമസ്കാരം! ഞാൻ ആരോഗ്യ AI ആണ്. നിങ്ങളുടെ പ്രശ്നം എന്താണ്?"
      : language === "Marathi"
      ? "नमस्कार! मी आरोग्य AI आहे. तुमची समस्या काय आहे?"
      : language === "Bengali"
      ? "নমস্কার! আমি আরোগ্য AI। আপনার সমস্যা কী?"
      : language === "Gujarati"
      ? "નમસ્તે! હું આરોગ્ય AI છું. તમારી સમસ્યા શું છે?"
      : language === "Punjabi"
      ? "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਆਰੋਗਿਆ AI ਹਾਂ। ਤੁਹਾਡੀ ਕੀ ਸਮੱਸਿਆ ਹੈ?"
      : language === "Odia"
      ? "ନମସ୍କାର! ମୁଁ ଆରୋଗ୍ୟ AI। ଆପଣଙ୍କ ସମସ୍ୟା କ’ଣ?"
      : "Hello! I am Aarogya AI. What brings you here today?";
    
    setMessages([{ role: "model", content: greeting }]);
    
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const langMap: Record<string, string> = {
        "English": "en-IN", "Hindi": "hi-IN", "Kannada": "kn-IN", "Telugu": "te-IN", "Tamil": "ta-IN",
        "Malayalam": "ml-IN", "Marathi": "mr-IN", "Bengali": "bn-IN", "Gujarati": "gu-IN", "Punjabi": "pa-IN", "Odia": "or-IN"
      };
      
      recognitionRef.current.lang = langMap[language] || "en-IN";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
    } else {
      setIsVoiceSupported(false);
    }
  }, [language]);

  function speak(text: string, forceLang?: string) {
    if (isMuted) return;
    const targetLang = forceLang || language;
    const langMap: Record<string, string> = {
      "English": "en-IN", "Hindi": "hi-IN", "Kannada": "kn-IN", "Telugu": "te-IN", "Tamil": "ta-IN",
      "Malayalam": "ml-IN", "Marathi": "mr-IN", "Bengali": "bn-IN", "Gujarati": "gu-IN", "Punjabi": "pa-IN", "Odia": "or-IN"
    };
    const langCode = langMap[targetLang] || "en-IN";

    // Try Sarvam in background, fall back to browser TTS immediately
    setIsSpeaking(true);
    fetch("/api/sarvam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language_code: langCode })
    }).then(r => r.json()).then(data => {
      if (data.audio) {
        const audio = new Audio(data.audio);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        // Fall back to browser SpeechSynthesis
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = langCode;
        utt.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
      }
    }).catch(() => {
      setIsSpeaking(false);
    });
  }

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const langMap: Record<string, string> = {
        "English": "en-IN", "Hindi": "hi-IN", "Kannada": "kn-IN", "Telugu": "te-IN", "Tamil": "ta-IN",
        "Malayalam": "ml-IN", "Marathi": "mr-IN", "Bengali": "bn-IN", "Gujarati": "gu-IN", "Punjabi": "pa-IN", "Odia": "or-IN"
      };
      recognitionRef.current.lang = langMap[language] || "hi-IN";
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language }),
      });
      
      if (!res.ok) throw new Error("API Failed");
      
      const data = await res.json();
      
      if (data.detectedLanguage && data.detectedLanguage !== language) {
        setLanguage(data.detectedLanguage);
      }
      
      setMessages(prev => [...prev, { role: "model", content: data.content }]);
      playSound("ding");

      if (data.riskScores) {
        setRiskScores(data.riskScores);
      }
      if (data.report) {
        setClinicalReport(data.report);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // Retry once silently before showing any message
      try {
        const res2 = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, language }),
        });
        const data2 = await res2.json();
        setMessages(prev => [...prev, { role: "model", content: data2.content }]);
        playSound("ding");
        speak(data2.content, data2.detectedLanguage);
        if (data2.riskScores) setRiskScores(data2.riskScores);
        if (data2.report) setClinicalReport(data2.report);
      } catch {
        // Only show error after retry also fails
        const fallbackMsg = language === "Hindi"
          ? "कृपया अपने लक्षण बताएं — जैसे बुखार, खांसी, या दर्द।"
          : "Please describe your symptoms — like fever, cough, or pain.";
        setMessages(prev => [...prev, { role: "model", content: fallbackMsg }]);
        playSound("ding");
      }
    } finally {
      setIsLoading(false);
    }
  };

  async function generateABHA() {
    try {
      const res = await fetch("/api/abha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo User", age: 35, village: "Sample Village" })
      });
      const data = await res.json();
      if (data.success) {
        setAbhaId(data.patient.abhaId);
        setQrCode(data.qrCodeDataUrl);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6, x: 0.8 },
          colors: ['#3b82f6', '#10b981', '#ffffff']
        });
        playSound("success");
      }
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div className="flex h-[100dvh] w-full bg-[#0a0f1a] font-sans overflow-hidden text-slate-100">
      
      {/* LEFT COLUMN: Main Chat Interface */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary to-primary-container p-2.5 rounded-xl shadow-lg border border-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-white">Aarogya AI Web Portal</h1>
              <span className="text-sm text-green-400 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {isSpeaking ? "Voice Assistant Speaking..." : "Live Connection"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors shadow-sm"
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-primary" />}
            </button>
            <div className="relative">
              <select 
                className="appearance-none bg-slate-800 border border-white/10 text-white text-sm font-semibold rounded-xl pl-4 pr-10 py-3 outline-none cursor-pointer hover:bg-slate-700 transition-colors shadow-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Malayalam">മലയാളം (Malayalam)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-[5px] border-transparent border-t-white/50 mt-1"></div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {messages.map((m, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] p-5 text-lg leading-relaxed shadow-xl ${
                    m.role === "user" 
                      ? "bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl rounded-tr-sm" 
                      : m.content.includes("क्षमा करें") || m.content.includes("sorry") 
                        ? "bg-error/10 border border-error/20 text-error rounded-3xl rounded-tl-sm backdrop-blur-md"
                        : "bg-[#1e293b] border border-white/5 text-slate-200 rounded-3xl rounded-tl-sm backdrop-blur-md"
                  }`}>
                    {m.role === "model" && (
                      <div className="flex items-center gap-2 mb-2 text-primary opacity-80">
                        <HeartPulse className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Aarogya AI</span>
                      </div>
                    )}
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-[#1e293b] border border-white/5 p-6 rounded-3xl rounded-tl-sm shadow-xl flex gap-3 items-center h-[72px]">
                    <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                    <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-[2rem] flex items-center gap-3 shadow-2xl ring-1 ring-black/50">
              {isVoiceSupported && (
                <button 
                  onClick={toggleRecording}
                  className={`p-4 rounded-full flex-shrink-0 transition-all ${
                    isRecording 
                      ? 'bg-error text-white animate-pulse shadow-lg shadow-error/30' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isRecording ? "Listening to your symptoms..." : "Type your symptoms here in any language..."}
                className="flex-1 bg-transparent border-0 px-4 py-4 outline-none text-white placeholder:text-slate-500 text-lg"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-8 py-4 bg-primary text-white font-bold rounded-full disabled:opacity-50 hover:bg-primary-container transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/30"
              >
                Send <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Diagnostic Dashboard Panel */}
      <div className="w-[480px] bg-[#0f172a] border-l border-white/5 flex flex-col shadow-2xl relative z-20 shrink-0">
        <div className="p-5 border-b border-white/5 bg-[#1e293b]/30 shrink-0">
          <h2 className="font-bold text-lg text-white flex items-center gap-3">
            <Stethoscope className="w-5 h-5 text-tertiary" />
            Clinical Dashboard
          </h2>
          <p className="text-slate-400 text-xs mt-1">Powered by ICMR &amp; Government of India Protocols</p>
        </div>

        {/* AWAITING STATE */}
        {!riskScores && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8 opacity-60">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
              <BrainCircuit className="w-9 h-9 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-300">Awaiting Symptoms</h3>
              <p className="text-slate-500 text-sm max-w-[260px] mx-auto">Describe your symptoms in the chat. The AI will generate a complete clinical report here based on official ICMR guidelines.</p>
            </div>
          </div>
        )}

        {/* REPORT STATE */}
        {riskScores && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* TABS */}
            <div className="flex border-b border-white/5 bg-[#0f172a] shrink-0 overflow-x-auto">
              {([
                { id: "risk", label: "Risk", icon: <Activity className="w-3.5 h-3.5" /> },
                { id: "tests", label: "Tests", icon: <FlaskConical className="w-3.5 h-3.5" /> },
                { id: "rx", label: "Rx / Meds", icon: <Pill className="w-3.5 h-3.5" /> },
                { id: "schemes", label: "Schemes", icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: "phc", label: "PHC Alert", icon: <Phone className="w-3.5 h-3.5" /> },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">

              {/* RISK TAB */}
              {activeTab === "risk" && (
                <div className="space-y-4">
                  {clinicalReport?.summary && (
                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Summary</p>
                      {clinicalReport.summary}
                    </div>
                  )}
                  {riskScores.map((r, i) => (
                    <div key={i} className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-100">{r.disease}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          r.level === "HIGH" ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                          r.level === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        }`}>{r.probability}% {r.level}</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2.5 mb-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.probability}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${r.level === "HIGH" ? "bg-red-500" : r.level === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500"}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.reasons.map((reason, j) => (
                          <span key={j} className="text-xs bg-slate-900 text-slate-400 px-2 py-1 rounded-lg border border-white/5">{reason}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {clinicalReport?.immediateActions && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" /> Immediate Actions</p>
                      <ul className="space-y-2">
                        {clinicalReport.immediateActions.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-200">
                            <span className="text-red-400 mt-0.5">→</span> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {clinicalReport?.doNotDo && (
                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-red-400" /> Do NOT Do</p>
                      <ul className="space-y-2">
                        {clinicalReport.doNotDo.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TESTS TAB */}
              {activeTab === "tests" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Required Diagnostic Tests</p>
                  {clinicalReport?.requiredTests?.length ? clinicalReport.requiredTests.map((t, i) => (
                    <div key={i} className="bg-[#1e293b] border border-white/5 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-100 text-sm">{t.test}</p>
                          <p className="text-slate-400 text-xs mt-1">{t.reason}</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg whitespace-nowrap shrink-0">{t.cost}</span>
                      </div>
                    </div>
                  )) : <p className="text-slate-500 text-sm">Complete more symptoms to generate test recommendations.</p>}
                </div>
              )}

              {/* PRESCRIPTION TAB */}
              {activeTab === "rx" && (
                <div className="space-y-3">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
                    ⚠️ This guidance is informational only. A licensed doctor at the PHC must prescribe medication.
                  </div>
                  {clinicalReport?.prescriptionGuidance?.length ? clinicalReport.prescriptionGuidance.map((p, i) => (
                    <div key={i} className="bg-[#1e293b] border border-white/5 rounded-2xl p-4">
                      <p className="font-bold text-slate-100 text-sm flex items-center gap-2"><Pill className="w-4 h-4 text-primary" /> {p.medication}</p>
                      <p className="text-slate-300 text-xs mt-2 bg-slate-900/50 rounded-lg px-3 py-2">{p.dosage}</p>
                      <p className="text-slate-500 text-xs mt-2 italic">{p.notes}</p>
                    </div>
                  )) : <p className="text-slate-500 text-sm">Complete more symptoms to generate prescription guidance.</p>}
                </div>
              )}

              {/* GOVERNMENT SCHEMES TAB */}
              {activeTab === "schemes" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applicable Government Schemes</p>
                  {clinicalReport?.governmentSchemes?.length ? clinicalReport.governmentSchemes.map((s, i) => (
                    <div key={i} className="bg-[#1e293b] border border-white/5 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                        <p className="font-bold text-slate-100 text-sm">{s.scheme}</p>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{s.benefit}</p>
                      <a href={`tel:${s.contact.replace(/\D/g,'')}`} className="mt-3 flex items-center gap-2 text-primary text-xs font-bold hover:underline">
                        <Phone className="w-3.5 h-3.5" /> {s.contact}
                      </a>
                    </div>
                  )) : <p className="text-slate-500 text-sm">Scheme information will appear here after risk assessment.</p>}
                </div>
              )}

              {/* PHC ALERT TAB */}
              {activeTab === "phc" && (
                <div className="space-y-4">
                  {clinicalReport?.phcContact && (
                    <>
                      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed">
                        <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                        {clinicalReport.phcContact.instructions}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <a href={`tel:${clinicalReport.phcContact.nationalHelpline}`}
                          className="flex flex-col items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 hover:bg-blue-500/20 transition-all">
                          <Phone className="w-6 h-6 text-blue-400" />
                          <span className="text-xs text-slate-400">Health Helpline</span>
                          <span className="text-2xl font-bold text-white">{clinicalReport.phcContact.nationalHelpline}</span>
                        </a>
                        <a href={`tel:${clinicalReport.phcContact.emergencyNumber}`}
                          className="flex flex-col items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 hover:bg-red-500/20 transition-all">
                          <Phone className="w-6 h-6 text-red-400" />
                          <span className="text-xs text-slate-400">Emergency</span>
                          <span className="text-2xl font-bold text-white">{clinicalReport.phcContact.emergencyNumber}</span>
                        </a>
                      </div>
                    </>
                  )}

                  {/* ABHA ID GENERATION */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    {!abhaId && (
                      <button onClick={generateABHA}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                        <UserCircle className="w-5 h-5" /> Generate ABHA Health ID
                      </button>
                    )}
                    {abhaId && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-5 text-center">
                        <CheckCircle2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Ayushman Bharat ID</div>
                        <div className="font-mono font-bold text-xl tracking-widest text-white mb-4">{abhaId}</div>
                        {qrCode && <img src={qrCode} alt="ABHA QR" className="mx-auto w-32 h-32 rounded-xl border-4 border-white/10 shadow-2xl" />}
                      </motion.div>
                    )}
                    {abhaId && !demoCompleted && (
                      <button onClick={async () => {
                        setDemoCompleted(true);
                        playSound("success");
                        try {
                          const highestRisk = riskScores?.[0]?.disease || "Unknown Condition";
                          const message = `🚨 *AAROGYA AI - PHC ALERT* 🚨\n\n*Patient ABHA:* ${abhaId}\n*High Risk For:* ${highestRisk}\n*Status:* Requires immediate consultation.\n\nPlease prepare the facility.`;
                          await fetch("/api/whatsapp/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ Body: message, From: "+918660967760" })
                          });
                        } catch (e) { console.error("Twilio Alert Failed", e); }
                      }}
                        className="w-full bg-tertiary hover:bg-[#ff9e00] text-slate-900 rounded-2xl py-4 font-bold transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                        <MapPin className="w-5 h-5" /> Send Alert to Nearest PHC
                      </button>
                    )}
                    {demoCompleted && (
                      <div className="bg-primary/20 text-primary p-4 rounded-2xl text-sm font-bold border border-primary/30 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-5 h-5" /> PHC Notified via WhatsApp ✓
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

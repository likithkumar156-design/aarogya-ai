"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const DEMO_PASSWORD = "aarogya2026";

export default function DemoPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string ?? "en";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setUnlocked(true);
      setTimeout(() => router.push(`/${locale}/chat`), 1200);
    } else {
      setError("Incorrect password. Hint: aarogya + year");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      {/* Glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className={`relative z-10 w-full max-w-md ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <img src="/logo-icon.png" alt="Aarogya AI" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Developer Area</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Live Demo Access</h1>
            <p className="text-slate-400 text-sm">Enter the demo password to access the full Aarogya AI experience.</p>
          </div>

          {/* Form */}
          {!unlocked ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password..."
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Launch Demo
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <p className="text-white font-semibold">Access granted! Launching demo...</p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[progress_1.2s_ease-in-out_forwards]" style={{ width: "100%" }} />
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-slate-600 text-xs mt-6">
            Aarogya AI · For authorized demo access only
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%        { transform: translateX(-8px); }
          40%        { transform: translateX(8px); }
          60%        { transform: translateX(-6px); }
          80%        { transform: translateX(6px); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Users, AlertTriangle, FileText, CheckSquare,
  Plus, BellRing, TrendingUp, MapPin, Phone,
  Activity, Clock, ChevronRight, Search, Filter
} from "lucide-react";

type Patient = {
  id: string;
  name: string;
  age: number;
  village: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  suspectedDisease: string;
  abhaId?: string;
  lastScreened: string;
  phone?: string;
  status: "Pending" | "Referred" | "Treated";
};

export default function AshaDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [reminderSent, setReminderSent] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    setPatients([
      { id: "1", name: "Ramesh Kumar",  age: 45, village: "Bidadi",      riskLevel: "HIGH",   suspectedDisease: "TB",         abhaId: "12-3456-7890-1234", lastScreened: "Today, 9:30 AM",   phone: "+91 98765 43210", status: "Referred" },
      { id: "2", name: "Sunita Devi",   age: 32, village: "Kumbalgodu",  riskLevel: "MEDIUM", suspectedDisease: "Anemia",      lastScreened: "Today, 10:15 AM",  phone: "+91 87654 32109", status: "Pending" },
      { id: "3", name: "Raju Bhai",     age: 50, village: "Nelmangala",  riskLevel: "LOW",    suspectedDisease: "None",        abhaId: "12-9876-5432-1098", lastScreened: "Yesterday",        phone: "+91 76543 21098", status: "Treated" },
      { id: "4", name: "Lakshmi",       age: 28, village: "Hoskote",     riskLevel: "HIGH",   suspectedDisease: "TB",          lastScreened: "Today, 11:00 AM",  phone: "+91 65432 10987", status: "Pending" },
      { id: "5", name: "Kiran",         age: 60, village: "Devanahalli", riskLevel: "HIGH",   suspectedDisease: "Diabetes",    abhaId: "12-1111-2222-3333", lastScreened: "Today, 8:45 AM",   phone: "+91 54321 09876", status: "Referred" },
      { id: "6", name: "Meena Kumari",  age: 24, village: "Bidadi",      riskLevel: "MEDIUM", suspectedDisease: "Malnutrition",lastScreened: "Yesterday",        phone: "+91 43210 98765", status: "Pending" },
      { id: "7", name: "Arjun Singh",   age: 55, village: "Hoskote",     riskLevel: "HIGH",   suspectedDisease: "Hypertension",abhaId: "12-4444-5555-6666", lastScreened: "Today, 7:30 AM",   phone: "+91 32109 87654", status: "Referred" },
    ]);
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.village.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "ALL" || p.riskLevel === filterRisk;
    return matchSearch && matchRisk;
  });

  const highCount    = patients.filter(p => p.riskLevel === "HIGH").length;
  const pendingCount = patients.filter(p => p.status === "Pending").length;
  const abhaCount    = patients.filter(p => p.abhaId).length;

  const sendReminders = async () => {
    setReminderSent(false);
    await new Promise(r => setTimeout(r, 1200));
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const riskBadge = (level: string) => {
    if (level === "HIGH")   return "bg-red-100 text-red-700 border border-red-200";
    if (level === "MEDIUM") return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  };

  const statusBadge = (status: string) => {
    if (status === "Referred") return "bg-blue-100 text-blue-700";
    if (status === "Treated")  return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">

      {/* ── Top Nav ── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <h1 className="text-xl font-bold">ASHA Dashboard</h1>
            <p className="text-sm text-slate-500">Priya Sharma · Bidadi PHC · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {reminderSent && (
            <span className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-right-4">
              ✅ Reminders sent!
            </span>
          )}
          <button onClick={sendReminders} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            <BellRing className="w-4 h-4" />
            Send Reminders
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-green-600/20">
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Screened Today",  value: patients.length, icon: <Users className="w-5 h-5" />,          color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
            { label: "High Risk",       value: highCount,       icon: <AlertTriangle className="w-5 h-5" />,  color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100" },
            { label: "Pending Referral",value: pendingCount,    icon: <Clock className="w-5 h-5" />,          color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
            { label: "ABHA IDs Created",value: abhaCount,       icon: <CheckSquare className="w-5 h-5" />,    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100" },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-2xl border bg-white shadow-sm flex flex-col ${stat.border}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* ── Alert Banner for HIGH risk ── */}
        {highCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-red-900 font-medium">
                  {highCount} high-risk patients need immediate attention today
                </p>
                <p className="text-red-700 text-sm">Please arrange PHC referrals</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors shadow-sm">
              View All
            </button>
          </div>
        )}

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                  filterRisk === r
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content: Table + Detail ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Table */}
          <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">Recent Screenings</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">{filtered.length} patients</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Patient</th>
                    <th className="px-6 py-3 font-semibold">Risk</th>
                    <th className="px-6 py-3 font-semibold">Disease</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">ABHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`cursor-pointer transition-colors ${
                        selectedPatient?.id === p.id
                          ? "bg-slate-50"
                          : p.riskLevel === "HIGH"
                          ? "bg-red-50/20 hover:bg-red-50/60"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-medium text-xs">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-500">
                              {p.village} · {p.age}y
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${riskBadge(p.riskLevel)}`}>
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{p.suspectedDisease}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${statusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.abhaId ? (
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            ✓ {p.abhaId.slice(0,8)}…
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not generated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No patients found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Detail Panel */}
          {selectedPatient && (
            <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 animate-in fade-in slide-in-from-right-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xl">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-slate-500">{selectedPatient.age} years · {selectedPatient.village}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { label: "Risk Level",    value: selectedPatient.riskLevel,         highlight: selectedPatient.riskLevel === "HIGH" },
                  { label: "Disease",       value: selectedPatient.suspectedDisease,  highlight: false },
                  { label: "Status",        value: selectedPatient.status,            highlight: false },
                  { label: "Last Screened", value: selectedPatient.lastScreened,      highlight: false },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="text-sm text-slate-500">{row.label}</span>
                    <span className={`text-sm font-medium ${row.highlight ? "text-red-600 bg-red-50 px-2 py-0.5 rounded-md" : "text-slate-900"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                {selectedPatient.abhaId ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-green-700 text-xs font-bold mb-1">
                      <CheckSquare className="w-4 h-4" /> ABHA ID
                    </div>
                    <div className="font-mono text-sm font-medium text-green-900">{selectedPatient.abhaId}</div>
                  </div>
                ) : (
                  <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                    + Generate ABHA ID
                  </button>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-medium transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                  <FileText className="w-4 h-4" /> Refer
                </button>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors"
              >
                Close ✕
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom stats ── */}
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { label: "Villages Covered",    value: [...new Set(patients.map(p => p.village))].length, icon: "🏘️" },
            { label: "Referrals Today",     value: patients.filter(p => p.status === "Referred").length, icon: "📋" },
            { label: "Avg Screening Time",  value: "4.2 min", icon: "⏱️" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className="font-bold text-slate-900 leading-tight">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

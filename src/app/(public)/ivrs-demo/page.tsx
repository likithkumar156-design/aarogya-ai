"use client";
import { useState } from "react";

export default function IVRSDemo() {
  const [step, setStep] = useState("start");
  const [language, setLanguage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  const addResponse = (text: string) => {
    setResponses(prev => [...prev, text]);
  };

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    addResponse(`Selected: ${lang}`);
    setStep("q1");
  };

  const answerQuestion = (answer: string) => {
    addResponse(answer);
    if (step === "q1") {
      setStep("q2");
    } else {
      setStep("result");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
          📞 IVRS Demo - Aarogya AI
        </h1>

        <div className="bg-gray-100 p-6 rounded-lg mb-6 min-h-[200px]">
          <h2 className="font-semibold mb-4">Call Log:</h2>
          {responses.map((resp, i) => (
            <div key={i} className="mb-2 text-gray-700">• {resp}</div>
          ))}
        </div>

        {step === "start" && (
          <div className="space-y-4">
            <p className="text-center text-lg mb-4">Select Language</p>
            <button onClick={() => selectLanguage("Hindi")} 
                    className="w-full bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700">
              1 - Hindi
            </button>
            <button onClick={() => selectLanguage("English")} 
                    className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl hover:bg-blue-700">
              2 - English
            </button>
          </div>
        )}

        {(step === "q1" || step === "q2") && (
          <div className="space-y-4">
            <p className="text-center text-lg mb-4">
              {step === "q1" 
                ? (language === "Hindi" ? "Kya aapko 2 hafte se zyada khansi hai?" : "Do you have cough for more than 2 weeks?")
                : (language === "Hindi" ? "Kya aapko raat ko pasina aata hai?" : "Do you have night sweats?")}
            </p>
            <button onClick={() => answerQuestion("Yes")} 
                    className="w-full bg-red-600 text-white py-4 rounded-lg text-xl hover:bg-red-700">
              1 - Yes
            </button>
            <button onClick={() => answerQuestion("No")} 
                    className="w-full bg-gray-600 text-white py-4 rounded-lg text-xl hover:bg-gray-700">
              2 - No
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="text-center">
            <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-red-700 mb-2">HIGH RISK</h3>
              <p className="text-lg">TB Symptoms Detected</p>
              <p className="text-sm mt-2">Please visit nearest PHC immediately</p>
            </div>
            <button onClick={() => { setStep("start"); setResponses([]); }} 
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
              Start New Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

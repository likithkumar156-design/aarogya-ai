import { NextResponse } from "next/server";
import { analyzeSymptoms } from "@/lib/dataset-engine";
import { generateChatResponse } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages, language, state, age, gender } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    // ── STEP 1: Dataset engine always runs (instant, offline, accurate risk scores) ──
    const datasetResult = analyzeSymptoms(
      messages,
      language || "English",
      state    || "Uttar Pradesh",
      age      || 35,
      gender   || "Unknown"
    );

    // ── STEP 2: Try Groq for natural conversational text ──────────────────────
    // Only use Groq for the chat content (follow-up questions / closing message)
    // Risk scores, report, tests, schemes always come from the dataset engine
    let finalContent      = datasetResult.content;
    let detectedLanguage  = datasetResult.detectedLanguage;

    try {
      const groqResult = await generateChatResponse(messages, language || "English");

      // Use Groq's conversational content if valid, but keep dataset risk scores
      if (groqResult?.content && typeof groqResult.content === "string") {
        finalContent = groqResult.content;
      }
      if (groqResult?.detectedLanguage) {
        detectedLanguage = groqResult.detectedLanguage;
      }

      // If Groq also returned risk scores, merge: dataset scores take priority
      // but use Groq scores as supplement if dataset found nothing
      if (!datasetResult.riskScores && groqResult?.riskScores) {
        datasetResult.riskScores = groqResult.riskScores;
        datasetResult.report     = groqResult.report;
      }
    } catch (groqErr) {
      // Groq failed — silently fall back to dataset content (already set above)
      console.warn("Groq unavailable, using dataset engine response:", groqErr);
    }

    return NextResponse.json({
      role:             "model",
      content:          finalContent,
      detectedLanguage: detectedLanguage,
      isSummary:        !!datasetResult.riskScores,
      riskScores:       datasetResult.riskScores,   // always from dataset
      report:           datasetResult.report,        // always from dataset
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      role:             "model",
      content:          "Please describe your symptoms and I'll help you right away.",
      detectedLanguage: "English",
      isSummary:        false,
      riskScores:       null,
      report:           null,
    });
  }
}

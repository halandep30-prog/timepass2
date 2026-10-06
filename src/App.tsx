import { useEffect, useState } from "react";
import { generatePlan } from "./gemini";
import Result from "./Result";
import type { ProjectPlan } from "./types";

const STEPS = [
  "Understanding project idea",
  "Identifying requirements",
  "Selecting technologies",
  "Designing architecture",
  "Planning database",
  "Creating roadmap",
  "Preparing viva questions",
];

const QUICK = [
  { label: "💡 AI Project", text: "AI-powered crop disease detection system" },
  { label: "🌐 Web Project", text: "College event management platform" },
  { label: "📱 Mobile Project", text: "Student study planner mobile application" },
];

type Status = "idle" | "loading" | "done" | "error";

export default function App() {
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (status !== "loading") return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    return () => clearInterval(id);
  }, [status]);

  async function handleGenerate() {
    if (!idea.trim() || status === "loading") return;
    setStatus("loading");
    setError("");
    setPlan(null);
    try {
      const result = await generatePlan(idea.trim());
      setPlan(result);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-violet-600/25 blur-3xl" />

      <main className="relative mx-auto max-w-6xl px-5 py-12 md:py-16">
        <header className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
            🤖 Powered by Gemini
          </div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-4xl font-extrabold text-transparent md:text-6xl">
            College Project AI Agent
          </h1>
          <p className="mt-4 text-lg text-slate-300 md:text-xl">
            Turn your project idea into a complete project plan with AI.
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
            }}
            rows={3}
            placeholder="AI-powered college attendance system"
            aria-label="Describe your project idea..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 p-4 text-lg text-white placeholder-slate-500 outline-none focus:border-cyan-400/60"
          />
          <p className="mt-2 text-sm text-slate-400">Describe your project idea...</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => setIdea(q.text)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
              >
                {q.label}
              </button>
            ))}
            <button
              onClick={() => setIdea("AI-powered College Attendance System")}
              className="rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 transition hover:bg-violet-400/20"
            >
              Try Example
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!idea.trim() || status === "loading"}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === "loading" ? "Generating..." : "🚀 Generate Project"}
          </button>
        </div>

        {status === "loading" && (
          <div className="fade-up mx-auto mt-8 max-w-3xl rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">🤖 AI Agent</h2>
            <ul className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 text-lg transition-opacity ${i > step ? "opacity-25" : "opacity-100"}`}>
                  {i < step ? (
                    <span className="text-emerald-400">✓</span>
                  ) : i === step ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                  ) : (
                    <span className="text-slate-600">○</span>
                  )}
                  <span className="text-slate-200">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "error" && (
          <div className="fade-up mx-auto mt-8 max-w-3xl rounded-2xl border border-red-400/40 bg-red-500/10 p-5">
            <p className="font-semibold text-red-300">Could not generate the project</p>
            <p className="mt-1 text-sm text-red-200">{error}</p>
            <button onClick={handleGenerate} className="mt-3 rounded-lg border border-red-300/40 px-4 py-2 text-sm text-red-100 hover:bg-red-400/10">
              Try again
            </button>
          </div>
        )}

        {status === "done" && plan && <Result plan={plan} />}

        <footer className="mt-16 text-center text-sm text-slate-500">College Seminar MVP · React + Vite + Gemini</footer>
      </main>
    </div>
  );
}

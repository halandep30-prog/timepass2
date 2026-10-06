import type { ProjectPlan } from "./types";

const MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a college project architect. Help students transform project ideas into realistic final-year software projects. Recommend technologies appropriate for their skill level and project complexity. Keep suggestions practical and achievable.

Return ONLY valid JSON (no markdown, no commentary) with exactly this shape:
{
  "title": "string",
  "category": "string (e.g. AI/ML, Web, Mobile, IoT)",
  "difficulty": "Beginner | Intermediate | Advanced",
  "problem": "string, 3-4 sentences",
  "solution": "string, 3-4 sentences",
  "objectives": ["4-5 short strings"],
  "features": ["6-8 short strings"],
  "techStack": { "frontend": "", "backend": "", "database": "", "ai": "use 'Not required' if the project needs no AI", "deployment": "" },
  "architecture": ["ordered layers from user to storage, e.g. Student, Frontend, Backend, AI Model, Database. Include 'AI Model' only if the project needs AI"],
  "database": [ { "table": "TableName", "columns": ["id", "name"] } ],
  "roadmap": [ { "week": "Week 1", "title": "short title", "tasks": "one sentence customized to this project" } ],
  "viva": [ { "question": "string", "answer": "string, 2-3 sentences" } ]
}
Rules: 3-5 database tables; exactly 6 roadmap weeks; exactly 5 viva questions.`;

const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : []);

function normalize(raw: any): ProjectPlan {
  const t = raw?.techStack ?? {};
  const plan: ProjectPlan = {
    title: str(raw?.title, "Untitled Project"),
    category: str(raw?.category, "Software"),
    difficulty: str(raw?.difficulty, "Intermediate"),
    problem: str(raw?.problem),
    solution: str(raw?.solution),
    objectives: strList(raw?.objectives),
    features: strList(raw?.features),
    techStack: {
      frontend: str(t.frontend, "-"),
      backend: str(t.backend, "-"),
      database: str(t.database, "-"),
      ai: str(t.ai, "Not required"),
      deployment: str(t.deployment, "-"),
    },
    architecture: strList(raw?.architecture),
    database: Array.isArray(raw?.database)
      ? raw.database.map((d: any) => ({ table: str(d?.table, "Table"), columns: strList(d?.columns) }))
      : [],
    roadmap: Array.isArray(raw?.roadmap)
      ? raw.roadmap.map((r: any, i: number) => ({
          week: str(r?.week, `Week ${i + 1}`),
          title: str(r?.title),
          tasks: str(r?.tasks),
        }))
      : [],
    viva: Array.isArray(raw?.viva)
      ? raw.viva.map((v: any) => ({ question: str(v?.question), answer: str(v?.answer) }))
      : [],
  };
  if (!plan.problem || !plan.solution || plan.features.length === 0) {
    throw new Error("The AI response was incomplete.");
  }
  if (plan.architecture.length === 0) plan.architecture = ["Student", "Frontend", "Backend", "Database"];
  return plan;
}

export async function generatePlan(idea: string): Promise<ProjectPlan> {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("Missing API key. Add VITE_GEMINI_API_KEY to your .env file and restart npm run dev.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `Student project idea: ${idea}` }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );

  if (!res.ok) {
    let msg = `Gemini request failed (${res.status}).`;
    try {
      const e = await res.json();
      if (e?.error?.message) msg = e.error.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text: string = (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p?.text ?? "").join("");
  if (!text) throw new Error("Gemini returned an empty response. Please try again.");

  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The AI returned invalid JSON. Please click Generate again.");
  }
  return normalize(parsed);
}

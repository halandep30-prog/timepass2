import type { ReactNode } from "react";
import type { ProjectPlan } from "./types";

function Card({ title, icon, children, className = "", delay = 0 }: { title: string; icon: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={`fade-up rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-xl backdrop-blur ${className}`}
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-300">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-base text-slate-200">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Result({ plan }: { plan: ProjectPlan }) {
  const stack: [string, string][] = [
    ["Frontend", plan.techStack.frontend],
    ["Backend", plan.techStack.backend],
    ["Database", plan.techStack.database],
    ["AI / ML", plan.techStack.ai],
    ["Deployment", plan.techStack.deployment],
  ];

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <Card title="Project Overview" icon="📌" className="lg:col-span-2 border-cyan-400/30">
        <h2 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
          {plan.title}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">Category: {plan.category}</span>
          <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-1 text-sm text-violet-200">Difficulty: {plan.difficulty}</span>
        </div>
      </Card>

      <Card title="Problem" icon="❗" delay={80}>
        <p className="leading-relaxed text-slate-200">{plan.problem}</p>
      </Card>
      <Card title="Solution" icon="💡" delay={140}>
        <p className="leading-relaxed text-slate-200">{plan.solution}</p>
      </Card>

      <Card title="Objectives" icon="🎯" delay={200}>
        <BulletList items={plan.objectives} />
      </Card>
      <Card title="Features" icon="✨" delay={260}>
        <BulletList items={plan.features} />
      </Card>

      <Card title="Tech Stack" icon="🛠️" delay={320}>
        <dl className="space-y-3">
          {stack.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 sm:flex-row sm:gap-4">
              <dt className="w-28 shrink-0 text-sm font-semibold text-blue-300">{k}</dt>
              <dd className="text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="Architecture" icon="🏗️" delay={380}>
        <div className="flex flex-col items-center">
          {plan.architecture.map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="min-w-[180px] rounded-xl border border-cyan-400/40 bg-gradient-to-r from-blue-500/20 to-violet-500/20 px-6 py-2 text-center font-medium text-white">
                {node}
              </div>
              {i < plan.architecture.length - 1 && <div className="py-1 text-xl text-cyan-300">↓</div>}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Database" icon="🗄️" className="lg:col-span-2" delay={440}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.database.map((t, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 font-semibold text-cyan-300">{t.table}</div>
              <ul className="space-y-1 font-mono text-sm text-slate-300">
                {t.columns.map((c, j) => (
                  <li key={j}>- {c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Roadmap" icon="🗺️" className="lg:col-span-2" delay={500}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.roadmap.map((r, i) => (
            <div key={i} className="rounded-xl border border-violet-400/20 bg-violet-500/5 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-violet-300">{r.week}</div>
              <div className="mt-1 font-semibold text-white">{r.title}</div>
              <p className="mt-1 text-sm text-slate-300">{r.tasks}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Viva Questions" icon="🎓" className="lg:col-span-2" delay={560}>
        <div className="space-y-4">
          {plan.viva.map((v, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-cyan-200">Q{i + 1}. {v.question}</p>
              <p className="mt-2 text-slate-300">{v.answer}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

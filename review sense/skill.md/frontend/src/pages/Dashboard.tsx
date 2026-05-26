import { useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Zap, Terminal, LogOut, GitBranch } from "lucide-react";

const PIPELINES = [
  { name: "scaffold", desc: "Generate feature: route + page + hook", icon: "⚡" },
  { name: "analyze", desc: "Feed data → Claude → structured JSON", icon: "🔍" },
  { name: "report", desc: "Generate .docx / .pdf report", icon: "📄" },
  { name: "docgen", desc: "IEEE / academic document generation", icon: "📝" },
  { name: "discover", desc: "Enumerate targets / CVE match", icon: "🎯" },
];

export default function Dashboard() {
  const { user, logout, fetchMe } = useAuthStore();

  useEffect(() => { fetchMe(); }, [fetchMe]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="text-yellow-400" size={22} />
          <span className="text-lg font-bold tracking-tight">antigravity</span>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">v1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user?.email ?? "—"}</span>
          <button onClick={logout} className="text-zinc-500 hover:text-zinc-200 transition">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-yellow-400">$</span> vibe coding, activated
        </h1>
        <p className="text-zinc-400 mb-10 text-sm">
          AI-native full-stack. Drop in, run pipelines, ship features.
        </p>

        {/* Pipeline Grid */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 uppercase tracking-widest">
            <Terminal size={12} /> Pipelines
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PIPELINES.map((p) => (
              <Link
                key={p.name}
                to={`/pipeline?p=${p.name}`}
                className="group border border-zinc-800 hover:border-yellow-400/40 bg-zinc-900 hover:bg-zinc-800/60 rounded-lg p-4 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="font-bold text-sm text-zinc-100 group-hover:text-yellow-400 transition">
                      {p.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{p.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick start */}
        <section className="border border-zinc-800 rounded-lg p-5 bg-zinc-900">
          <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 uppercase tracking-widest">
            <GitBranch size={12} /> Quick Start
          </div>
          <pre className="text-sm text-zinc-300 leading-relaxed overflow-x-auto">
{`# Scaffold a new feature
make scaffold f="user profile page"

# Run analysis pipeline
make pipeline p=analyze

# Dev mode
make dev`}
          </pre>
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { usePipeline } from "@/hooks/usePipeline";
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PipelinePage() {
  const [params] = useSearchParams();
  const [pipeline, setPipeline] = useState(params.get("p") || "analyze");
  const [inputJson, setInputJson] = useState("{}");
  const { run, job, loading, error, reset } = usePipeline();

  useEffect(() => {
    if (params.get("p")) setPipeline(params.get("p")!);
  }, [params]);

  const handleRun = () => {
    try {
      const parsed = JSON.parse(inputJson);
      run(pipeline, parsed);
    } catch {
      alert("Invalid JSON input");
    }
  };

  const statusIcon = {
    queued: <Loader2 size={16} className="animate-spin text-zinc-400" />,
    running: <Loader2 size={16} className="animate-spin text-yellow-400" />,
    done: <CheckCircle size={16} className="text-green-400" />,
    error: <XCircle size={16} className="text-red-400" />,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 mb-8 transition">
        <ArrowLeft size={14} /> back
      </Link>

      <h1 className="text-2xl font-bold mb-1">
        <span className="text-yellow-400">$</span> pipeline runner
      </h1>
      <p className="text-zinc-500 text-sm mb-8">Execute Antigravity pipelines</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Config */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Pipeline</label>
            <input
              value={pipeline}
              onChange={(e) => setPipeline(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400/60 transition"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Input (JSON)</label>
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              rows={8}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 font-mono focus:outline-none focus:border-yellow-400/60 transition resize-none"
              placeholder='{"feature": "user auth"}'
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-sm px-5 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              <Play size={14} /> Run
            </button>
            <button onClick={reset} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-sm px-4 py-2.5 border border-zinc-800 rounded-lg transition">
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Output</label>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 min-h-[300px]">
            {!job && !error && (
              <p className="text-zinc-600 text-sm">Run a pipeline to see output...</p>
            )}
            {job && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  {statusIcon[job.status]}
                  <span className="text-zinc-400">job <span className="text-zinc-200">{job.jobId}</span></span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    job.status === "done" ? "bg-green-900/40 text-green-400" :
                    job.status === "error" ? "bg-red-900/40 text-red-400" :
                    "bg-zinc-800 text-zinc-400"
                  }`}>{job.status}</span>
                </div>
                {job.result && (
                  <pre className="text-xs text-zinc-300 overflow-auto max-h-96 leading-relaxed">
                    {JSON.stringify(job.result, null, 2)}
                  </pre>
                )}
                {job.error && <p className="text-red-400 text-sm">{job.error}</p>}
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

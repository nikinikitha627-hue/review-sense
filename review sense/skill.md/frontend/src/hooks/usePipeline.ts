import { useState, useCallback } from "react";
import { pipelineApi } from "@/lib/api";

interface PipelineJob {
  jobId: string;
  status: "queued" | "running" | "done" | "error";
  result?: unknown;
  error?: string;
}

export function usePipeline() {
  const [job, setJob] = useState<PipelineJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (pipeline: string, input?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await pipelineApi.run(pipeline, input);
      const newJob: PipelineJob = { jobId: data.job_id, status: "queued" };
      setJob(newJob);
      // Poll for completion
      await poll(data.job_id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Pipeline failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const poll = useCallback(async (jobId: string) => {
    for (let i = 0; i < 60; i++) {
      await sleep(2000);
      const { data } = await pipelineApi.status(jobId);
      setJob({ jobId, status: data.status, result: data.result, error: data.error });
      if (data.status === "done" || data.status === "error") break;
    }
  }, []);

  const reset = () => { setJob(null); setError(null); };

  return { run, job, loading, error, reset };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

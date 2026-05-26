import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Auth token injection ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ag_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-logout on 401 ───────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ag_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Pipeline helpers ─────────────────────────────────────────────
export const pipelineApi = {
  list: () => api.get("/pipeline/"),
  run: (pipeline: string, input?: Record<string, unknown>) =>
    api.post("/pipeline/run", { pipeline, input }),
  status: (jobId: string) => api.get(`/pipeline/status/${jobId}`),
};

// ── Auth helpers ─────────────────────────────────────────────────
export const authApi = {
  register: (email: string, password: string, username: string) =>
    api.post("/auth/register", { email, password, username }),
  login: (email: string, password: string) => {
    const form = new FormData();
    form.append("username", email);
    form.append("password", password);
    return api.post("/auth/token", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  me: () => api.get("/auth/me"),
};

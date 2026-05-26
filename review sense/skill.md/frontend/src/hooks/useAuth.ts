import { create } from "zustand";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("ag_token"),
  isAuthenticated: !!localStorage.getItem("ag_token"),

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem("ag_token", data.access_token);
    set({ token: data.access_token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("ag_token");
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  fetchMe: async () => {
    try {
      const { data } = await authApi.me();
      set({ user: data });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

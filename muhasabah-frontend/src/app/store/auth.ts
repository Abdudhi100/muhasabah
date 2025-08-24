// src/store/auth.ts
import { create } from "zustand";

type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  location?: string;
  whatsapp?: string;
};

type Tokens = { access?: string; refresh?: string };

type AuthState = {
  user: User | null;
  tokens: Tokens | null;
  setAuth: (u: User | null, t?: Tokens | null) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  setAuth: (user, tokens = null) => set({ user, tokens }),
  clear: () => set({ user: null, tokens: null }),
}));

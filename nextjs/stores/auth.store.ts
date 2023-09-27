import { User } from "@/models/user.model";
import { create } from "zustand";

interface Auth {
  user?: User;
  accessToken?: string;
}

interface AuthState {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {},
  setAuth: (auth) => set(() => ({ auth })),
  clearAuth: () => set(() => ({ auth: {} })),
}));

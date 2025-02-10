import { create } from "zustand";
import { User } from "firebase/auth";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  loginWithGoogle,
  signUpWithGoogle,
} from "../services/authServices";

interface IAuthCredentials {
  email: string;
  password: string;
}

interface GoogleAuthCredentials {
  token: string;
}

export interface IAuthStore {
  user: User | null;
  loading: boolean; // Додаємо поле для відслідковування завантаження
  login: (credentials: IAuthCredentials) => Promise<void>;
  signUp: (credentials: IAuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => void;
  loginWithGoogle: (credentials: GoogleAuthCredentials) => Promise<void>;
  signUpWithGoogle: (credentials: GoogleAuthCredentials) => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  loading: false,

  login: async ({ email, password }: IAuthCredentials) => {
    set({ loading: true });
    try {
      const user = await loginUser(email, password);
      set({ user, loading: false });
    } catch (error) {
      console.error("Login failed:", error);
      set({ loading: false });
      throw error;
    }
  },

  signUp: async ({ email, password }: IAuthCredentials) => {
    set({ loading: true });
    try {
      const user = await registerUser(email, password);
      set({ user, loading: false });
    } catch (error) {
      console.error("Sign up failed:", error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await logoutUser();
      set({ user: null, loading: false });
    } catch (error) {
      console.error("Logout failed:", error);
      set({ loading: false });
      throw error;
    }
  },

  fetchCurrentUser: () => {
    // Якщо користувач уже є в стані, не робимо запит
    if (useAuthStore.getState().user) return;

    console.log("Fetching current user...");
    set({ loading: true });

    getCurrentUser()
      .then((user) => {
        console.log("User fetched:", user);
        set({ user, loading: false });
      })
      .catch((error) => {
        console.error("Failed to fetch current user:", error);
        set({ loading: false });
      });
  },

  loginWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    set({ loading: true });
    try {
      const user = await loginWithGoogle(token);
      set({ user, loading: false });
      console.log("Google login successful");
    } catch (error) {
      console.error("Google login failed:", error);
      set({ loading: false });
      throw error;
    }
  },

  signUpWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    set({ loading: true });
    try {
      const user = await signUpWithGoogle(token);
      set({ user, loading: false });
      console.log("Google sign-up successful");
    } catch (error) {
      console.error("Google sign-up failed:", error);
      set({ loading: false });
      throw error;
    }
  },
}));

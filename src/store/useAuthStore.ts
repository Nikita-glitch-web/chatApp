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
  login: (credentials: IAuthCredentials) => Promise<void>;
  signUp: (credentials: IAuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => void;
  loginWithGoogle: (credentials: GoogleAuthCredentials) => Promise<void>;
  signUpWithGoogle: (credentials: GoogleAuthCredentials) => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,

  login: async ({ email, password }: IAuthCredentials) => {
    try {
      const user = await loginUser(email, password);
      set({ user });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  signUp: async ({ email, password }: IAuthCredentials) => {
    try {
      const user = await registerUser(email, password);
      set({ user });
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  fetchCurrentUser: () => {
    getCurrentUser()
      .then((user) => {
        set({ user });
      })
      .catch((error) => {
        console.error("Failed to fetch current user:", error);
      });
  },

  loginWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    try {
      const user = await loginWithGoogle(token);
      set({ user });
      console.log("Google login successful");
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  },

  signUpWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    try {
      const user = await signUpWithGoogle(token);
      set({ user });
      console.log("Google sign-up successful");
    } catch (error) {
      console.error("Google sign-up failed:", error);
      throw error;
    }
  },
}));

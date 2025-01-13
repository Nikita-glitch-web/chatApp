import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase.config";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

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
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  signUp: async ({ email, password }: IAuthCredentials) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user });
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  fetchCurrentUser: () => {
    onAuthStateChanged(auth, (currentUser) => {
      console.log(">>>>>>>>", currentUser);
      set({ user: currentUser });
    });
  },

  loginWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    try {
      const credential = GoogleAuthProvider.credential(token);
      const { user } = await signInWithCredential(auth, credential);
      set({ user });
      console.log("Google login successful");
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  },

  signUpWithGoogle: async ({ token }: GoogleAuthCredentials) => {
    try {
      const credential = GoogleAuthProvider.credential(token);
      const { user } = await signInWithCredential(auth, credential);
      set({ user });
      console.log("Google sign-up successful");
    } catch (error) {
      console.error("Google sign-up failed:", error);
      throw error;
    }
  },
}));

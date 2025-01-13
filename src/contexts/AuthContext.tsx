import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthStore } from "../store/useAuthStore";

interface IAuthContext {
  user: unknown;
  login: unknown;
  signUp: unknown;
  logout: unknown;
  isLoading: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const authStore = useAuthStore();

  if (!authStore) {
    throw new Error("useAuthStore did not return the expected object.");
  }

  const { user, login, signUp, logout, fetchCurrentUser } = authStore;
  const [isLoading, setIsLoading] = useState(true); // Індикатор завантаження

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isLoading }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

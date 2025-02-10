import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthLoading) {
    return <div>Loading...</div>; // Показуємо поки аутентифікація триває
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

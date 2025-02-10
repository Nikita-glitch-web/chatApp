import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Button } from "@mui/material";
import { SignUpForm } from "./components/Auth/SignupForm/SignupForm";
import { LoginForm } from "./components/Auth/LoginForm/LoginForm";
import { ChatPage } from "./components/Chat/ChatPage/ChatPage";
import UserProfile from "./components/User/UserProfile/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorPage } from "./components/common/ErrorPage/ErrorPage";
import { useAuthStore } from "./store/useAuthStore";
import { ProtectedRoute } from "./components/common/ProtectedRoute/ProtectedRoute";

const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useAuthStore();

  if (location.pathname === "/" || loading) return null;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(-1)}
      sx={{
        position: "fixed",
        top: 20,
        right: 130,
        zIndex: 1000,
      }}
    >
      ← Back
    </Button>
  );
};

const LogoutButton = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Переходимо на головну сторінку після логауту
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      Logout
    </Button>
  );
};

const App: React.FC = () => {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user && !loading) {
      fetchCurrentUser();
    }
  }, [user, loading, fetchCurrentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider clientId="975432713180-v1cv3mgbbmr8c9sv37ua194vph4sfm0s.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <BackButton />
          <LogoutButton />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="/chat/:chatId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

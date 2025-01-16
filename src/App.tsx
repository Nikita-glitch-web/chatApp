import "./styles/index.scss";
import { SignUpForm } from "./components/Auth/SignupForm/SignupForm";
import { LoginForm } from "./components/Auth/LoginForm/LoginForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorPage } from "./components/common/ErrorPage/ErrorPage";
import { CssBaseline } from "@mui/material";
import { ChatPage } from "./components/Chat/ChatPage/ChatPage";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="975432713180-v1cv3mgbbmr8c9sv37ua194vph4sfm0s.apps.googleusercontent.com">
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

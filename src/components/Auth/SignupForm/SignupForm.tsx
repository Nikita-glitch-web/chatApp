import { useState, useCallback } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { IAuthCredentials } from "../../../types/types";
import { CustomButton } from "../../common/Button/Button";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

type GoogleAuthCredentials = {
  token: string;
};

export const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const signUp = useAuthStore((state) => state.signUp);
  const signUpWithGoogle = useAuthStore((state) => state.signUpWithGoogle);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setError(null);

      const credentials: IAuthCredentials = { email, password };

      try {
        await signUp(credentials);
        console.log("User signed up successfully");
        navigate("/tasks"); // Перенаправлення на сторінку /tasks
      } catch (err) {
        setError("Failed to sign up. Please try again.");
        console.error("Sign-up error:", err);
      }
    },
    [email, password, confirmPassword, signUp, navigate]
  );

  const handleLoginRedirect = () => {
    navigate("/login"); // Перенаправлення на сторінку входу
  };

  const handleGoogleSuccess = async (response: any) => {
    const token = response?.credential;
    if (!token) {
      setError("Google sign-up failed. Missing token.");
      return;
    }
    try {
      await signUpWithGoogle({ token } as GoogleAuthCredentials); // Використання Google токену
      navigate("/tasks");
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
      console.error("Google Sign-up Error:", err);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-up failed. Please try again.");
    console.error("Google Sign-up Error");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        width: "100vw", // Займає всю ширину вікна
        height: "100vh", // Займає всю висоту вікна
        display: "flex", // Вмикає режим flexbox
        justifyContent: "center", // Центрує по горизонталі
        alignItems: "center", // Центрує по вертикалі
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Тінь для форми
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{ textAlign: "center", marginBottom: 2, fontSize: "32px" }}
        >
          Welcome to chat app!
        </Typography>

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          error={!!error && !email}
          helperText={!email && error}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          error={!!error && !password}
          helperText={!password && error}
        />

        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          error={!!error && !confirmPassword}
          helperText={!confirmPassword && error}
        />

        {error && <Box sx={{ color: "red", textAlign: "center" }}>{error}</Box>}

        <CustomButton type="submit">Sign Up</CustomButton>
        <CustomButton onClick={handleLoginRedirect}>Login</CustomButton>
        <Box sx={{ textAlign: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </Box>
      </Box>
    </Box>
  );
};

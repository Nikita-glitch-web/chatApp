import { useState, useCallback } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { CustomButton } from "../../common/Button/Button";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useChatStore } from "../../../store/useChatStore"; // Приклад імпорту для стейту чату

type GoogleAuthCredentials = {
  token: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  // Отримуємо chatId зі стору
  const chatId = useChatStore((state) => state.chatId);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
        setError("Please fill in both fields.");
        return;
      }

      setError(null);

      try {
        await login({ email, password });

        // Завантажуємо чати після логіну
        await useChatStore.getState().loadChats();

        // Перевіряємо, чи є активний чат, і встановлюємо chatId
        if (chatId) {
          useChatStore.getState().setChatId(chatId); // Оновлюємо chatId в сторі
          navigate(`/chat/:${chatId}`);
        } else {
          setError("No active chat available.");
          console.error("No active chat found in the store");
        }

        console.log("User logged in successfully");
      } catch (err) {
        setError("Login failed. Please try again.");
        console.error("Login error:", err);
        navigate("/error", {
          state: { message: "Login failed. Please try again." },
        });
      }
    },
    [email, password, login, navigate, chatId]
  );

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = async (response: any) => {
    const token = response?.credential;
    if (!token) {
      setError("Google login failed. Missing token.");
      navigate("/error", {
        state: { message: "Google login failed. Missing token." },
      });
      return;
    }
    try {
      await loginWithGoogle({ token } as GoogleAuthCredentials);

      // Якщо chatId є в сторі, переходимо на чат
      if (chatId) {
        navigate(`/chat/${chatId}`);
      } else {
        setError("No active chat available.");
        console.error("No active chat found in the store");
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google Login error:", err);
      navigate("/error", {
        state: { message: "Google login failed. Please try again." },
      });
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    console.error("Google Login Error");
    navigate("/error", {
      state: { message: "Google login failed. Please try again." },
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "32px",
            textAlign: "center",
          }}
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
        {error && <Box sx={{ color: "red", textAlign: "center" }}>{error}</Box>}
        <CustomButton type="submit">
          <Typography variant="body1">Login</Typography>
        </CustomButton>
        <CustomButton onClick={handleSignupRedirect}>
          <Typography variant="body1">Signup</Typography>
        </CustomButton>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GoogleLogin
            useOneTap
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            containerProps={{
              style: {
                width: "400px",
                display: "flex",
                justifyContent: "center",
              },
            }}
            text="continue_with"
          />
        </Box>
      </Box>
    </Box>
  );
};

import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "An unexpected error occurred.";

  return (
    <Box
      sx={{
        position: "absolute", // Займає всю область вікна
        top: 0,
        left: 0,
        width: "100%", // Повна ширина
        height: "100vh", // Повна висота
        display: "flex", // Flexbox для центрування
        alignItems: "center", // Вирівнювання по вертикалі
        justifyContent: "center", // Вирівнювання по горизонталі
        flexDirection: "column", // Вертикальне розташування елементів
        textAlign: "center", // Центрування тексту
        backgroundColor: "#f9f9f9", // Опціональний фон
        padding: 4,
        margin: 0,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "2rem", color: "red" }}>
        Oops, something went wrong!
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {message}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ marginTop: 2 }}
      >
        Back to Login
      </Button>
    </Box>
  );
};

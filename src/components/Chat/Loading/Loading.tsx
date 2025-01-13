import { Box, CircularProgress } from "@mui/material";

export const ErrorPage: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute", // Займає всю область вікна
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        padding: 4,
        margin: 0,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

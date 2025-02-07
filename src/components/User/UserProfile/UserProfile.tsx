import React from "react";
import { Box, Paper } from "@mui/material";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { UserBio } from "../UserBio/UserBio";

const UserProfile: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Центрування по вертикалі
        gap: 4, // Відступ між компонентами
      }}
    >
      <Paper
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <UserAvatar />
        <UserBio />
      </Paper>
    </Box>
  );
};

export default UserProfile;

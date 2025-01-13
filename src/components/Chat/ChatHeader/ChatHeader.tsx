import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type ChatHeaderProps = {
  name: string; // Contact name or chat name
  avatar: string; // Avatar img
  status?: string; // Status online or not
  onBack?: () => void; // Back button
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  status,
  onBack,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
      }}
    >
      {onBack && (
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Avatar src={avatar} alt={name} sx={{ marginRight: "12px" }} />
        <Box>
          <Typography variant="h6" sx={{ margin: 0 }}>
            {name}
          </Typography>
          {status && (
            <Typography variant="caption" sx={{ color: "#777" }}>
              {status}
            </Typography>
          )}
        </Box>
      </Box>
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

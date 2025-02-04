import React from "react";
import { Box, Typography, List, ListItem, Avatar } from "@mui/material";
import { Timestamp } from "firebase/firestore";
type Message = {
  text?: string;
  imageUrl?: string;
  senderId: string;
  timestamp: string | Timestamp; // Дозволяємо як рядок, так і Firebase Timestamp
};

type MessageWindowProps = {
  messages: Message[];
  currentUser: string | null;
};

export const MessageWindow: React.FC<MessageWindowProps> = ({
  messages,
  currentUser,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        marginBottom: 2,
        padding: "40px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              flexDirection:
                message.senderId === currentUser ? "row-reverse" : "row",
              marginBottom: 1,
            }}
          >
            <Avatar>{message.senderId === currentUser ? "You" : "A"}</Avatar>
            <Box sx={{ marginLeft: 1, maxWidth: "80%" }}>
              <Typography
                sx={{
                  backgroundColor:
                    message.senderId === currentUser ? "#e0f7fa" : "#f1f8e9",
                  padding: 1,
                  borderRadius: 2,
                }}
              >
                {message.text}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

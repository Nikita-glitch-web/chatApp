import React from "react";
import { Box, Typography, List, ListItem, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import UserStore from "../../../store/useProfileStore"; // Імпортуємо UserStore

type Message = {
  text?: string;
  imageUrl?: string;
  senderId: string;
  timestamp: string;
  senderAvatar?: string;
};

type MessageWindowProps = {
  messages: Message[];
  currentUser: string | null;
};

export const MessageWindow: React.FC<MessageWindowProps> = ({
  messages,
  currentUser,
}) => {
  const userStore = UserStore; // Отримуємо доступ до UserStore

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
            {/* Перевірка доступу до профілю */}
            {userStore.hasAccessToProfile(message.senderId) ? (
              <Link
                to={`/profile/${message.senderId}`}
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  src={message.senderAvatar} // Використовуємо URL аватара
                  sx={{ cursor: "pointer" }}
                >
                  {!message.senderAvatar ? "A" : ""}
                </Avatar>
              </Link>
            ) : (
              <Avatar
                src={message.senderAvatar}
                sx={{ cursor: "not-allowed" }}
              />
            )}

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

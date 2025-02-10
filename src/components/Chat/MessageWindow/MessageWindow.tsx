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
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser;
          return (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection: isCurrentUser ? "row-reverse" : "row",
                alignItems: "center",
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
                    {!message.senderAvatar ? "you" : ""}
                  </Avatar>
                </Link>
              ) : (
                <Avatar
                  src={message.senderAvatar}
                  sx={{ cursor: "not-allowed" }}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isCurrentUser ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  marginLeft: isCurrentUser ? 0 : 1,
                  marginRight: isCurrentUser ? 1 : 0,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: isCurrentUser ? "#e0f7fa" : "#f1f8e9",
                    padding: 1,
                    borderRadius: 2,
                  }}
                >
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "gray",
                    marginTop: "2px",
                    alignSelf: isCurrentUser ? "flex-start" : "flex-end",
                  }}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

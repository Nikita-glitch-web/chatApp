import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Box,
  Typography,
} from "@mui/material";

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
};

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (id: string) => void; // Callback при виборі чату!!!
};

export const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <Box
      sx={{
        width: "300px",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: "10px 16px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#fff",
          fontWeight: "bold",
        }}
      >
        Chats
      </Typography>
      <List>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            component="a"
            onClick={() => onSelectChat(chat.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
          >
            <ListItemAvatar>
              <Avatar src={chat.avatar} alt={chat.name} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={`${chat.lastMessage.slice(0, 20)}...`}
              sx={{
                "& .MuiListItemText-primary": { fontWeight: "bold" },
                "& .MuiListItemText-secondary": { color: "#666" },
              }}
            />
            {chat.unreadCount && (
              <Badge
                badgeContent={chat.unreadCount}
                color="primary"
                sx={{ marginLeft: "auto" }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { db } from "../../../store/firebase.config";
import { collection, addDoc } from "firebase/firestore";

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  members: string[]; // Обов'язкове поле
};

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onNewChatCreated: (chat: Chat) => Promise<void>; // Підтримка асинхронності
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  onNewChatCreated,
}) => {
  const [showCreateChatForm, setShowCreateChatForm] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>("");
  const [newChatUsers, setNewChatUsers] = useState<string>("");

  const handleCreateChat = async () => {
    if (!newChatName || !newChatUsers) return;

    const usersArray = newChatUsers.split(",").map((user) => user.trim());
    const newChatData = {
      name: newChatName,
      avatar: "", // Можна додати аватар, якщо потрібно
      lastMessage: "",
      time: "",
      members: usersArray,
    };

    // Додаємо новий чат у Firestore
    const newChatRef = await addDoc(collection(db, "chats"), newChatData);

    const newChat: Chat = {
      id: newChatRef.id,
      ...newChatData,
    };

    // Передаємо новий чат у батьківський компонент
    await onNewChatCreated(newChat);

    // Очищаємо форму
    setNewChatName("");
    setNewChatUsers("");
    setShowCreateChatForm(false);
  };

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
              secondary={
                chat.lastMessage
                  ? `${chat.lastMessage.slice(0, 20)}...`
                  : "No messages yet"
              }
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

      {!showCreateChatForm && (
        <Button
          onClick={() => setShowCreateChatForm(true)}
          variant="contained"
          color="primary"
          sx={{ marginTop: 4 }}
        >
          Create Chat
        </Button>
      )}

      {showCreateChatForm && (
        <Box sx={{ marginTop: 4, padding: 2 }}>
          <TextField
            label="Chat Name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Users (comma separated)"
            value={newChatUsers}
            onChange={(e) => setNewChatUsers(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleCreateChat}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Create Chat
          </Button>
        </Box>
      )}
    </Box>
  );
};

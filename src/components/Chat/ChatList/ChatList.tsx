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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Chat } from "../../../store/useChatStore";

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onCreateChat: (name: string, users: string[]) => Promise<void>;
  onUpdateChat: (id: string, name: string, users: string[]) => Promise<void>;
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  onCreateChat,
  onUpdateChat,
}) => {
  const [showCreateChatForm, setShowCreateChatForm] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>("");
  const [newChatUsers, setNewChatUsers] = useState<string>("");

  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [editChatName, setEditChatName] = useState<string>("");
  const [editChatUsers, setEditChatUsers] = useState<string>("");

  const handleCreateChat = async () => {
    if (!newChatName || !newChatUsers) return;

    const usersArray = newChatUsers.split(",").map((user) => user.trim());

    try {
      await onCreateChat(newChatName, usersArray);
      setNewChatName("");
      setNewChatUsers("");
      setShowCreateChatForm(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleEditChat = (chat: Chat) => {
    setEditingChat(chat);
    setEditChatName(chat.name);
    setEditChatUsers("");
  };

  const handleUpdateChat = async () => {
    if (!editingChat || !editChatName) return;

    const usersArray = editChatUsers
      ? editChatUsers.split(",").map((user) => user.trim())
      : [];

    try {
      await onUpdateChat(editingChat.id, editChatName, usersArray);
      setEditingChat(null);
      setEditChatName("");
      setEditChatUsers("");
    } catch (error) {
      console.error("Error updating chat:", error);
    }
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
            onDoubleClick={() => handleEditChat(chat)}
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
          sx={{ marginTop: 4, marginLeft: "18px" }}
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

      {editingChat && (
        <Dialog open={!!editingChat} onClose={() => setEditingChat(null)}>
          <DialogTitle>Edit Chat</DialogTitle>
          <DialogContent>
            <TextField
              label="Chat Name"
              value={editChatName}
              onChange={(e) => setEditChatName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Add Users (comma separated)"
              value={editChatUsers}
              onChange={(e) => setEditChatUsers(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingChat(null)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateChat}
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

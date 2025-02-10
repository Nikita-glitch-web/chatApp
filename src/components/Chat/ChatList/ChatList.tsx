import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; // імпортуємо useNavigate
import { Chat } from "../../../services/chatServices";

type ChatListProps = {
  chats: Chat[];
  onSelectChat: (id: string) => void;
  onCreateChat: (name: string, users: string[]) => Promise<void>;
  onUpdateChat: (id: string, name: string, users: string[]) => Promise<void>;
  onAddUserToChat: (chatId: string, userEmail: string) => Promise<void>;
  onDeleteChat: (id: string) => void;
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  onCreateChat,
  onUpdateChat,
  onAddUserToChat,
  onDeleteChat,
}) => {
  const navigate = useNavigate(); // ініціалізація useNavigate
  const [showCreateChatForm, setShowCreateChatForm] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatUsers, setNewChatUsers] = useState("");
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [editChatName, setEditChatName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showError = (message: string) =>
    setSnackbar({ open: true, message, severity: "error" });

  const handleCreateChat = async () => {
    if (!newChatName || !newChatUsers)
      return showError("Please fill in all fields!");
    const usersArray = newChatUsers.split(",").map((user) => user.trim());
    await onCreateChat(newChatName, usersArray);
    setSnackbar({
      open: true,
      message: "Chat created successfully",
      severity: "success",
    });
    setNewChatName("");
    setNewChatUsers("");
    setShowCreateChatForm(false);
  };

  const handleUpdateChat = async () => {
    if (!editingChat) return showError("No chat selected to edit!");
    await onUpdateChat(editingChat.id, editChatName || editingChat.name, []);
    setSnackbar({ open: true, message: "Chat updated", severity: "success" });
    setEditingChat(null);
    setEditChatName("");
  };

  const handleAddUser = async () => {
    if (!editingChat || !newUserEmail)
      return showError("Please provide a valid email and select a chat!");
    await onAddUserToChat(editingChat.id, newUserEmail);
    setSnackbar({ open: true, message: "User added", severity: "success" });
    setNewUserEmail("");
  };

  return (
    <Box
      sx={{
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
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
            onClick={() => {
              onSelectChat(chat.id); // Викликаємо onSelectChat
              navigate(`/chat/${chat.id}`); // Оновлюємо URL без перезавантаження сторінки
            }}
            onDoubleClick={() => setEditingChat(chat)}
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
            {/* Іконка для видалення чату */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Запобігаємо вибору чату при натисканні на кнопку
                onDeleteChat(chat.id);
              }}
              color="error"
              sx={{ marginLeft: "auto" }}
            >
              <DeleteIcon />
            </IconButton>
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
              value={editChatName || editingChat.name}
              onChange={(e) => setEditChatName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Add User by Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingChat(null)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
            >
              Add User
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

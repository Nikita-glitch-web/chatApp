import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export const MessageWindow = () => {
  // Стан для повідомлень та введеного тексту
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([
    { text: "Привіт!", sender: "user1" },
    { text: "Привіт, як справи?", sender: "user2" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Функція для обробки відправки повідомлення
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setLoading(true);
      // Імітуємо затримку для відправки повідомлення
      setTimeout(() => {
        setMessages([...messages, { text: newMessage, sender: "user1" }]);
        setNewMessage("");
        setLoading(false);
      }, 1000); // Затримка в 1 секунду для імітації відправки
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        padding: 2,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Секція для відображення списку повідомлень */}
      <Box sx={{ flex: 1, overflowY: "auto", marginBottom: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                flexDirection:
                  message.sender === "user1" ? "row-reverse" : "row",
                marginBottom: 1,
              }}
            >
              <Avatar>{message.sender === "user1" ? "U1" : "U2"}</Avatar>
              <Box sx={{ marginLeft: 1, maxWidth: "80%" }}>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor:
                      message.sender === "user1" ? "#e0f7fa" : "#f1f8e9",
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
        {loading && (
          <CircularProgress sx={{ margin: "auto", display: "block" }} />
        )}
      </Box>

      <Divider sx={{ marginBottom: 2 }} />

      {/* Секція для вводу нового повідомлення */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Напишіть повідомлення..."
          multiline
          rows={2}
          sx={{ marginRight: 1 }}
        />
        <IconButton onClick={handleSendMessage} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

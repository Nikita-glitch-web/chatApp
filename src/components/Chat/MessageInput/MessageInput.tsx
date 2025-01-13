import React, { useState } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from "@mui/icons-material/Attachment";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message); // Викликаємо функцію для відправки
      setMessage(""); // Очищаємо поле після відправки
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 1,
        borderTop: "1px solid #ccc",
      }}
    >
      {/* Поле для введення тексту повідомлення */}
      <TextField
        value={message}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        placeholder="Напишіть повідомлення..."
        multiline
        rows={2}
        sx={{ marginRight: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <AttachmentIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <IconButton onClick={handleSend} disabled={!message.trim()}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send"; // Іконка стрілки

type MessageInputProps = {
  onSendMessage: (text: string) => void;
  onSendImage: (imageFile: File) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText(""); // Очистка поля після відправки
    }
  };

  return (
    <Box sx={{ display: "flex", padding: 2, backgroundColor: "#fff" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Напишіть повідомлення"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <IconButton
        onClick={handleSend}
        sx={{
          marginLeft: 1,
          padding: "12px",
          backgroundColor: "#e0f7fa",
          "&:hover": { backgroundColor: "#b2ebf2" },
          "&:focus": { outline: "none" },
          minWidth: "48px",
          minHeight: "48px",
          borderRadius: "8px",
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

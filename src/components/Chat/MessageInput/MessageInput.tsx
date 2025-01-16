// MessageInput.tsx
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type MessageInputProps = {
  onSendMessage: (text: string) => void;
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
      />
      <Button onClick={handleSend} sx={{ marginLeft: 2 }}>
        Відправити
      </Button>
    </Box>
  );
};

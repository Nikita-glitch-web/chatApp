import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send"; // Іконка стрілки
import PhotoIcon from "@mui/icons-material/Photo"; // Іконка для фото

type MessageInputProps = {
  onSendMessage: (text: string) => void;
  onSendImage: (imageFile: File) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendImage,
}) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null); // Вибране зображення
  const [previewOpen, setPreviewOpen] = useState(false); // Стан діалогу попереднього перегляду

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText(""); // Очистка поля після відправки
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewOpen(true);
    }
  };

  const handleSendImage = () => {
    if (image) {
      onSendImage(image);
      setImage(null);
      setPreviewOpen(false);
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
        component="label"
        sx={{
          marginLeft: 1,
          backgroundColor: "#f1f8e9",
          "&:hover": { backgroundColor: "#dcedc8" },
        }}
      >
        <PhotoIcon />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </IconButton>
      <IconButton
        onClick={handleSend}
        sx={{
          marginLeft: 1,
          backgroundColor: "#e0f7fa",
          "&:hover": { backgroundColor: "#b2ebf2" },
          "&:focus": { outline: "none" },
        }}
      >
        <SendIcon />
      </IconButton>

      {/* Вікно попереднього перегляду зображення */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogTitle>Попередній перегляд</DialogTitle>
        <DialogContent>
          {image && (
            <Box
              component="img"
              src={URL.createObjectURL(image)}
              alt="preview"
              sx={{ width: 300, height: 300, objectFit: "cover" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendImage} color="primary">
            Send
          </Button>
          <Button onClick={() => setPreviewOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

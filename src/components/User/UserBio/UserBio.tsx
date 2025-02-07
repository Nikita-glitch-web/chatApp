import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import UserStore from "../../../store/useProfileStore";
import { auth } from "../../../services/firebase.config"; // Імпорт аутентифікації Firebase
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export const UserBio: React.FC = observer(() => {
  const userId = auth.currentUser?.uid; // Отримуємо userId
  const { firstName, lastName, bio } = UserStore.userProfile;
  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedBio, setEditedBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!userId) {
      console.error("User ID не знайдено");
      return;
    }

    await UserStore.updateProfile({
      firstName: editedFirstName,
      lastName: editedLastName,
      bio: editedBio,
    });

    setIsEditing(false);
  };

  return (
    <Card sx={{ maxWidth: 500, p: 3, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Інформація про користувача
        </Typography>
        {isEditing ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Ім'я"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{ sx: { fontSize: "1.1rem" } }}
            />
            <TextField
              label="Прізвище"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{ sx: { fontSize: "1.1rem" } }}
            />
            <TextField
              label="Опис"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              InputProps={{ sx: { fontSize: "1.1rem" } }}
            />
            <Button
              variant="contained"
              color="primary" // Оригінальний колір
              onClick={handleSave}
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                mt: 2,
              }}
              fullWidth
            >
              Зберегти
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Ім'я:</strong> {firstName || "Не вказано"}
            </Typography>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Прізвище:</strong> {lastName || "Не вказано"}
            </Typography>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Опис:</strong> {bio || "Не вказано"}
            </Typography>
            <Button
              variant="outlined" // Оригінальний колір кнопки
              onClick={() => setIsEditing(true)}
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                mt: 2,
              }}
              fullWidth
            >
              Редагувати
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

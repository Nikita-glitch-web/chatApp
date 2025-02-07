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
    <Card sx={{ maxWidth: 400, padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Інформація про користувача
        </Typography>
        {isEditing ? (
          <>
            <TextField
              label="Ім'я"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Прізвище"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Опис"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
            >
              Зберегти
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1">
              <strong>Ім'я:</strong> {firstName || "Не вказано"}
            </Typography>
            <Typography variant="body1">
              <strong>Прізвище:</strong> {lastName || "Не вказано"}
            </Typography>
            <Typography variant="body1">
              <strong>Опис:</strong> {bio || "Не вказано"}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
              fullWidth
            >
              Редагувати
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
});

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
    <Card
      sx={{
        maxWidth: 500,
        borderRadius: 3,
        boxShadow: "none",
        border: "none",
        p: 0, // Видалив padding
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Information about you!
        </Typography>
        {isEditing ? (
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField
              label="Ім'я"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              fullWidth
              InputProps={{
                sx: {
                  fontSize: "1.1rem",
                  background: "transparent",
                  border: "none",
                },
              }}
              variant="standard"
            />
            <TextField
              label="Прізвище"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              fullWidth
              InputProps={{
                sx: {
                  fontSize: "1.1rem",
                  background: "transparent",
                  border: "none",
                },
              }}
              variant="standard"
            />
            <TextField
              label="Опис"
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              fullWidth
              multiline
              rows={3}
              InputProps={{
                sx: {
                  fontSize: "1.1rem",
                  background: "transparent",
                  border: "none",
                },
              }}
              variant="standard"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                mt: 1,
              }}
              fullWidth
            >
              Зберегти
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Name:</strong> {firstName || "None"}
            </Typography>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Surname:</strong> {lastName || "None"}
            </Typography>
            <Typography variant="body1" fontSize="1.2rem">
              <strong>Description:</strong> {bio || "None"}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                mt: 1,
              }}
              fullWidth
            >
              Change
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

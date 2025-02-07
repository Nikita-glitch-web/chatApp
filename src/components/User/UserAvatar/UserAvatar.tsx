import React, { useRef, useState } from "react";
import { Avatar, CircularProgress, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import UserStore from "../../../store/useProfileStore";

export const UserAvatar: React.FC = observer(() => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // Відкриває вибір файлу при кліці на аватар
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await UserStore.updateAvatar(file);
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        boxShadow:
          "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        borderRadius: "50%",
      }}
    >
      <Avatar
        src={UserStore.userProfile.avatar || ""}
        sx={{ width: 160, height: 160, cursor: "pointer" }}
        onClick={handleAvatarClick}
      />
      {isUploading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Box>
  );
});

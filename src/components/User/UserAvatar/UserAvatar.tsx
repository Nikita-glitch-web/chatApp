import React, { useRef, useState } from "react";
import { Avatar, IconButton, CircularProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { observer } from "mobx-react-lite";
import UserStore from "../../../store/useProfileStore";

export const UserAvatar: React.FC = observer(() => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true); // Встановлюємо статус завантаження
      await UserStore.updateAvatar(file);
      setIsUploading(false); // Скидаємо статус завантаження після завершення
    }
  };

  return (
    <div className="relative w-40 h-40">
      <Avatar
        src={UserStore.userProfile.avatar || ""}
        sx={{ width: 160, height: 160, cursor: "pointer" }}
      />
      {isUploading ? (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 bg-gray-500">
          <CircularProgress />
        </div>
      ) : (
        <IconButton
          className="absolute bottom-0 right-0 bg-white"
          sx={{ borderRadius: "50%", boxShadow: 2 }}
          onClick={handleAvatarClick}
        >
          <PhotoCameraIcon />
        </IconButton>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
});

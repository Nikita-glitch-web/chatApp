import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ChatList } from "../ChatList/ChatList";
import { MessageWindow } from "../MessageWindow/MessageWindow";
import { MessageInput } from "../MessageInput/MessageInput";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  loadChats,
  subscribeToMessages,
  sendMessage,
  sendImage,
  createChat,
  addUserToChatByEmail,
  Chat,
  Message,
  deleteChat,
} from "../../../services/chatServices";

export const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isChatListOpen, setIsChatListOpen] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user.uid);
        try {
          const loadedChats = await loadChats(user.uid);
          setChats(loadedChats);
        } catch (error) {
          console.error("Error loading chats:", error);
        }
      } else {
        setCurrentUser(null);
        setChats([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentChat) return;

    const unsubscribe = subscribeToMessages(currentChat, setMessages);
    return () => unsubscribe();
  }, [currentChat]);

  const handleSendMessage = (text: string) => {
    if (currentChat && currentUser) {
      sendMessage(currentChat, currentUser, text);
    }
  };

  const handleSendImage = (imageFile: File) => {
    if (currentChat && currentUser) {
      sendImage(currentChat, currentUser, imageFile);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
    setIsChatListOpen(false); // Закриваємо список чатів після вибору на мобільному
  };

  const handleCreateChat = async (name: string, members: string[]) => {
    if (!currentUser) return;

    try {
      const newChat = await createChat(name, members);
      setChats((prevChats) => [...prevChats, newChat]);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleAddUserToChat = async (chatId: string, userEmail: string) => {
    if (!currentUser) return;

    try {
      await addUserToChatByEmail(chatId, userEmail);
      const updatedChat = chats.find((chat) => chat.id === chatId);
      if (updatedChat) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId
              ? { ...chat, members: [...chat.members, userEmail] }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error adding user to chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (currentChat === chatId) setCurrentChat(null);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleUpdateChat = async (
    id: string,
    name: string,
    users: string[]
  ) => {
    try {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === id ? { ...chat, name, members: users } : chat
        )
      );
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      {/* Кнопка для відкриття списку чатів на мобільних пристроях */}
      <IconButton
        onClick={() => setIsChatListOpen(true)}
        sx={{
          display: { xs: isChatListOpen ? "none" : "block", md: "none" },
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 10,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Список чатів */}
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          display: { xs: isChatListOpen ? "block" : "none", md: "block" },
          position: { xs: "absolute", md: "relative" },
          height: "100%",
          zIndex: 20,
          backgroundColor: "background.paper",
        }}
      >
        <IconButton
          onClick={() => setIsChatListOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 21,
            padding: "20px",
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <ChatList
          chats={chats}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onUpdateChat={handleUpdateChat}
          onAddUserToChat={handleAddUserToChat}
          onDeleteChat={handleDeleteChat}
        />
      </Box>

      {/* Вікно повідомлень */}
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: isChatListOpen ? "none" : "flex", md: "flex" },
          flexDirection: "column",
        }}
      >
        {currentChat ? (
          <>
            <MessageWindow messages={messages} currentUser={currentUser} />
            <MessageInput
              onSendMessage={handleSendMessage}
              onSendImage={handleSendImage}
            />
          </>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              marginTop: 4,
              marginLeft: 4,
              fontSize: "32px",
            }}
          >
            <p>Select a chat</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

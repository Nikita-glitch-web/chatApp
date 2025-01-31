import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
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
} from "../../../store/useChatStore";
import { deleteChat } from "../../../services/chatServices";

export const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const auth = getAuth();

  // Подписка на аутентификацию
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

  // Подписка на сообщения текущего чата
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
  };

  const handleCreateChat = async (name: string, users: string[]) => {
    if (!currentUser) return;

    try {
      const newChat = await createChat(name, [...users, currentUser]);
      setChats((prevChats) => [...prevChats, newChat]);
    } catch (error) {
      console.error("Error creating chat:", error);
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

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onUpdateChat={handleUpdateChat}
        onAddUserToChat={handleAddUserToChat}
        onDeleteChat={handleDeleteChat}
      />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
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

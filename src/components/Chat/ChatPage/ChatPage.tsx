import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ChatList } from "../ChatList/ChatList";
import { MessageWindow } from "../MessageWindow/MessageWindow";
import { MessageInput } from "../MessageInput/MessageInput";
import { getAuth } from "firebase/auth";
import {
  loadChats,
  subscribeToMessages,
  sendMessage,
  sendImage,
  createChat,
  Chat,
  Message,
} from "../../../store/useChatStore";

export const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const auth = getAuth();

  // Завантаження користувача та чатів
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
        loadChats(user.uid).then(setChats);
      } else {
        setCurrentUser(null);
        setChats([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Підписка на повідомлення обраного чату
  useEffect(() => {
    if (currentChat) {
      const unsubscribe = subscribeToMessages(currentChat, setMessages);
      return () => unsubscribe();
    }
  }, [currentChat]);

  // Відправлення текстового повідомлення
  const handleSendMessage = (text: string) => {
    if (currentChat && currentUser) {
      sendMessage(currentChat, currentUser, text);
    }
  };

  // Відправлення зображення
  const handleSendImage = (imageFile: File) => {
    if (currentChat && currentUser) {
      sendImage(currentChat, currentUser, imageFile);
    }
  };

  // Вибір чату
  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
  };

  // Створення нового чату
  const handleNewChatCreated = async (name: string, users: string[]) => {
    if (!currentUser) return;

    try {
      const newChat = await createChat(name, [...users, currentUser]);
      setChats((prevChats) => [...prevChats, newChat]);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChatCreated={handleNewChatCreated}
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

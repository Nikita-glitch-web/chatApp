import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ChatList } from "../ChatList/ChatList";
import { MessageWindow } from "../MessageWindow/MessageWindow";
import { MessageInput } from "../MessageInput/MessageInput";
import { getAuth } from "firebase/auth";
import { db } from "../../../store/firebase.config"; // Підключаємо Firebase
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
};

type Message = {
  text: string;
  senderId: string;
  timestamp: string;
};

export const ChatPage: React.FC = () => {
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "John",
      avatar: "",
      lastMessage: "Hi!",
      time: "12:00 PM",
    },
    {
      id: "2",
      name: "Alice",
      avatar: "",
      lastMessage: "Hello!",
      time: "12:05 PM",
    },
  ]);

  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const fetchMessages = async () => {
    if (!currentChat) return;

    const messagesRef = collection(db, "chats", currentChat, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);

    const loadedMessages: Message[] = [];
    querySnapshot.forEach((doc) => {
      loadedMessages.push(doc.data() as Message);
    });

    setMessages(loadedMessages);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChat || !currentUser) return;

    const newMessage: Message = {
      text,
      senderId: currentUser,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "chats", currentChat, "messages"), newMessage);

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <ChatList chats={chats} onSelectChat={(id) => setCurrentChat(id)} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {currentChat ? (
          <>
            <MessageWindow messages={messages} currentUser={currentUser} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <p>Виберіть чат для початку листування</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

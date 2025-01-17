import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ChatList } from "../ChatList/ChatList";
import { MessageWindow } from "../MessageWindow/MessageWindow";
import { MessageInput } from "../MessageInput/MessageInput";
import { getAuth } from "firebase/auth";
import { db, storage } from "../../../store/firebase.config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
};

type Message = {
  text?: string;
  imageUrl?: string;
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
      const unsubscribe = subscribeToMessages();
      return () => unsubscribe();
    }
  }, [currentChat]);

  const subscribeToMessages = () => {
    if (!currentChat) return () => {};

    const messagesRef = collection(db, "chats", currentChat, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        const message: Message = {
          text: data.text || "",
          imageUrl: data.imageUrl || "",
          senderId: data.senderId || "unknown", // Default senderId if missing
          timestamp:
            typeof data.timestamp?.toDate === "function"
              ? data.timestamp.toDate().toISOString()
              : data.timestamp || new Date().toISOString(),
        };

        loadedMessages.push(message);
      });

      setMessages(loadedMessages);
    });

    return unsubscribe;
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChat || !currentUser) return;

    const newMessage: Message = {
      text,
      senderId: currentUser,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "chats", currentChat, "messages"), newMessage);
  };

  const handleSendImage = async (imageFile: File) => {
    if (!currentChat || !currentUser) return;

    const imageRef = ref(storage, `chats/${currentChat}/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);

    const imageUrl = await getDownloadURL(imageRef);

    const newMessage: Message = {
      imageUrl,
      senderId: currentUser,
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, "chats", currentChat, "messages"), newMessage);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <ChatList chats={chats} onSelectChat={(id) => setCurrentChat(id)} />
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
            <p>Select chat</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

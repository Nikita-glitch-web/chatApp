import { db, storage } from "../store/firebase.config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ReactNode } from "react";

export type Chat = {
  unreadCount: ReactNode;
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  members: string[];
};

export type Message = {
  text?: string;
  imageUrl?: string;
  senderId: string;
  timestamp: string;
};

// Завантаження списку чатів для користувача
export const loadChats = async (userId: string): Promise<Chat[]> => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userId));

  const chatSnapshots = await getDocs(q);
  return chatSnapshots.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      avatar: data.avatar || "",
      lastMessage: data.lastMessage || "",
      time: data.time || "",
      members: data.members || [],
      unreadCount: 0, // Додаємо значення за замовчуванням
    };
  });
};

// Підписка на повідомлення в чаті
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        text: data.text || "",
        imageUrl: data.imageUrl || "",
        senderId: data.senderId || "unknown",
        timestamp:
          typeof data.timestamp?.toDate === "function"
            ? data.timestamp.toDate().toISOString()
            : data.timestamp || new Date().toISOString(),
      };
    });

    callback(messages);
  });
};

// Відправлення текстового повідомлення
export const sendMessage = async (
  chatId: string,
  userId: string,
  text: string
) => {
  const newMessage: Message = {
    text,
    senderId: userId,
    timestamp: new Date().toISOString(),
  };

  await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
  await updateLastMessage(chatId, text);
};

// Відправлення зображення
export const sendImage = async (
  chatId: string,
  userId: string,
  imageFile: File
) => {
  const imageRef = ref(storage, `chats/${chatId}/${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);

  const imageUrl = await getDownloadURL(imageRef);

  const newMessage: Message = {
    imageUrl,
    senderId: userId,
    timestamp: new Date().toISOString(),
  };

  await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
  await updateLastMessage(chatId, "Image sent");
};

// Оновлення останнього повідомлення в чаті
const updateLastMessage = async (chatId: string, message: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    time: new Date().toLocaleTimeString(),
  });
};

// Створення нового чату
export const createChat = async (
  name: string,
  members: string[]
): Promise<Chat> => {
  const newChatData = {
    name,
    avatar: "", // Опціонально можна додати URL до аватару
    lastMessage: "",
    time: "",
    members,
  };

  const newChatRef = await addDoc(collection(db, "chats"), newChatData);

  return {
    id: newChatRef.id,
    ...newChatData,
    unreadCount: 0,
  };
};

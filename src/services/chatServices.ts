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
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ReactNode } from "react";

// Типи для чату та повідомлення
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

// Завантаження списку чатів для користувача з Firestore
export const loadChats = async (userId: string): Promise<Chat[]> => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Chat)
  );
};

// Функція для прослуховування змін у чатах користувача
export const listenForUserChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  const chatsQuery = query(
    collection(db, "chats"),
    where("members", "array-contains", userId)
  );

  return onSnapshot(chatsQuery, (querySnapshot) => {
    const chats = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Chat)
    );
    callback(chats);
  });
};

// Додавання нового користувача в чат
export const addUserToChat = async (chatId: string, userId: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    members: arrayUnion(userId), // Додає користувача до members
  });
};
/**
 * Видаляє чат за його ID
 * @param chatId - ID чату, який потрібно видалити
 */
export const deleteChat = async (chatId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "chats", chatId));
    console.log(`Chat with ID ${chatId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw new Error("Failed to delete chat.");
  }
};

// Створення нового чату
export const createChat = async (
  name: string,
  members: string[]
): Promise<Chat> => {
  const newChatData = {
    name,
    avatar: "", // Опціонально: URL до аватару
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

// Додавання користувача в чат через email
export const addUserToChatByEmail = async (
  chatId: string,
  email: string
): Promise<void> => {
  const userUID = await getUIDByEmail(email);
  if (userUID) {
    await addUserToChat(chatId, userUID);
  } else {
    console.error(`User with email ${email} not found.`);
  }
};

// Пошук UID за email
export const getUIDByEmail = async (email: string): Promise<string | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }
  return null;
};

// Оновлення останнього повідомлення в чаті
const updateLastMessage = async (chatId: string, message: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    time: new Date().toISOString(),
  });
};

// Завантаження повідомлень для чату
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

// Оновлення загальних даних чату (наприклад, назви, аватара, членів)
export const updateChat = async (
  chatId: string,
  p0: string,
  p1: never[],
  updatedData: Partial<Chat>
) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, updatedData);
};

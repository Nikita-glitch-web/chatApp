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

// Типы для чата и сообщения
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

// Загрузка списка чатов для пользователя из Firestore
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

// Функция для прослушивания изменений в чатах пользователя
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

// Добавление нового пользователя в чат
export const addUserToChat = async (chatId: string, userId: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    members: arrayUnion(userId), // Добавляет пользователя в members
  });
};

// Функция для добавления пользователя в чат по email
export const addUserToChatByEmail = async (
  chatId: string,
  email: string
): Promise<void> => {
  try {
    const userSnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;

    await addUserToChat(chatId, userId);
  } catch (error) {
    console.error("Error adding user to chat:", error);
    throw error;
  }
};

// Удаление чата по его ID
export const deleteChat = async (chatId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "chats", chatId));
    console.log(`Chat with ID ${chatId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw new Error("Failed to delete chat.");
  }
};

// Создание нового чата
export const createChat = async (
  name: string,
  members: string[]
): Promise<Chat> => {
  const newChatData = {
    name,
    avatar: "",
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

// Обновление последнего сообщения в чате
const updateLastMessage = async (chatId: string, message: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    time: new Date().toISOString(),
  });
};

// Подписка на сообщения в чате
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

// Отправка текстового сообщения
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

// Отправка изображения
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

// Обновление данных чата
export const updateChat = async (
  chatId: string,
  updatedData: Partial<Chat>
) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, updatedData);
};

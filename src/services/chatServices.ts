/* eslint-disable @typescript-eslint/no-unused-vars */
import { db, storage } from "../store/firebase.config"; // Налаштування Firebase
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
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCurrentUser } from "./authServices";

export type Chat = {
  unreadCount: number;
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

// Створення нового чату
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

// Завантаження списку чатів для користувача
export const loadChats = async (): Promise<Chat[]> => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  const userId = currentUser?.uid;
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Chat)
  );
};

// Підписка на повідомлення чату
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

// Відправка текстового повідомлення
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

// Відправка зображення
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

// Оновлення чату
export const updateChat = async (
  chatId: string,
  updatedData: Partial<Chat>
) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, updatedData);
};

// Оновлення останнього повідомлення
const updateLastMessage = async (chatId: string, message: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    time: new Date().toISOString(),
  });
};

// Видалення чату
export const deleteChat = async (chatId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "chats", chatId));
    console.log(`Chat with ID ${chatId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw new Error("Failed to delete chat.");
  }
};

// Додавання користувача в чат за email
export const addUserToChatByEmail = async (chatId: string, email: string) => {
  try {
    // Пошук користувача по email в колекції "users"
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data(); // Отримуємо користувача
      const userId = querySnapshot.docs[0].id; // Отримуємо userId

      // Оновлюємо чат, додаючи нового учасника
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        members: arrayUnion(userId), // Додаємо новий userId до списку учасників чату
      });

      console.log(`User with email ${email} added to chat ${chatId}`);
    } else {
      console.log(`User with email ${email} not found`);
    }
  } catch (error) {
    console.error("Error adding user to chat:", error);
    throw new Error("Failed to add user to chat.");
  }
};

// Слухання змін чатів користувача
export const listenForUserChats = (
  userId: string,
  callback: (chats: Chat[]) => void
) => {
  console.log(userId);
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("members", "array-contains", userId)); // PROBLEMA TUTA!!!!!!!!!!

  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Chat)
    );

    callback(chats);
  });
};

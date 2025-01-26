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

// Завантаження списку чатів для користувача з Firestore
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

// Збереження списку чатів у Firestore
export const saveChats = async (
  userId: string,
  chats: Chat[]
): Promise<void> => {
  const userChatsRef = doc(db, "userChats", userId);
  await updateDoc(userChatsRef, { chats });
};

// Отримання кешованих чатів із Firestore
export const getCachedChats = async (
  userId: string
): Promise<Chat[] | null> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userChatsRef = doc(db, "userChats", userId);

  const userChatsDoc = await getDocs(
    query(collection(db, "userChats"), where("id", "==", userId))
  );
  if (!userChatsDoc.empty) {
    const userChatsData = userChatsDoc.docs[0].data();
    return userChatsData.chats || null;
  }
  return null;
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

// Пошук UID за email
export const getUIDByEmail = async (email: string): Promise<string | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    return userDoc.id; // UID користувача
  }
  return null; // Якщо користувач не знайдений
};

// Створення нового чату з email користувачів
export const createChatWithEmails = async (
  chatName: string,
  userEmails: string[]
): Promise<Chat | null> => {
  const userUIDs: string[] = [];

  for (const email of userEmails) {
    const uid = await getUIDByEmail(email);
    if (uid) {
      userUIDs.push(uid);
    } else {
      console.error(`User with email ${email} not found`);
    }
  }

  if (userUIDs.length > 0) {
    return createChat(chatName, userUIDs); // Викликає існуючу функцію створення чату
  } else {
    console.error("No valid users to add to the chat.");
    return null;
  }
};

// Існуюча функція створення чату
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

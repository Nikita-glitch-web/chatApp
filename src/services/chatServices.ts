import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../store/firebase.config";

// Тип повідомлення
export type Message = {
  id: string; // ID документа в Firestore
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number; // Час створення повідомлення
  chatId: string; // ID чату, до якого належить повідомлення
};

// Функція для отримання повідомлень з Firestore
export async function fetchMessages(chatId: string): Promise<Message[]> {
  try {
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatId", "==", chatId), // Фільтруємо повідомлення за chatId
      orderBy("timestamp", "asc") // Сортуємо повідомлення за часом
    );
    const querySnapshot = await getDocs(messagesQuery);

    const messages: Message[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Функція для додавання повідомлення в Firestore
export async function sendMessage(
  chatId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<void> {
  try {
    const message: Omit<Message, "id"> = {
      senderId,
      receiverId,
      text,
      timestamp: Date.now(),
      chatId,
    };

    // Додаємо повідомлення в колекцію `messages`
    await addDoc(collection(db, "messages"), message);

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Функція для прослуховування нових повідомлень у реальному часі
export function listenForMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): void {
  const messagesQuery = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc") // Сортуємо повідомлення за часом
  );

  // Прослуховуємо зміни в колекції
  onSnapshot(messagesQuery, (querySnapshot) => {
    const messages: Message[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    // Викликаємо колбек з новими повідомленнями
    callback(messages);
  });
}

// Функція для отримання чатів користувача
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchUserChats(userId: string): Promise<any[]> {
  try {
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", userId) // Фільтруємо за UID користувача
    );

    const querySnapshot = await getDocs(chatsQuery);

    const chats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return chats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

// Функція для створення нового чату
export async function createChat(members: string[]): Promise<void> {
  try {
    const chatData = {
      members, // Масив UID учасників
      createdAt: Date.now(),
    };

    await addDoc(collection(db, "chats"), chatData);

    console.log("Chat created successfully");
  } catch (error) {
    console.error("Error creating chat:", error);
  }
}

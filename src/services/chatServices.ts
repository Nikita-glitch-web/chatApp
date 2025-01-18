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

// Отримання повідомлень з Firestore
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

// Додавання повідомлення в Firestore
export async function sendMessage(
  chatId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<void> {
  try {
    const message: Message = {
      senderId,
      receiverId,
      text,
      timestamp: Date.now(),
      chatId,
      id: "",
    };

    // Додаємо повідомлення в колекцію `messages`
    await addDoc(collection(db, "messages"), message);

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Функція для прослуховування нових повідомлень в реальному часі
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

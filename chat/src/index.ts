import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";

// Ініціалізація Firebase Admin
admin.initializeApp();

// Структура даних для повідомлень
interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: admin.firestore.Timestamp; // якщо є поле timestamp
}

// Функція для отримання всіх повідомлень з колекції 'messages'
export const getMessages = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Отримання всіх документів з колекції 'messages'
      const snapshot = await admin.firestore().collection("messages").get();

      // Якщо колекція порожня
      if (snapshot.empty) {
        res.status(404).send("No messages found");
        return; // повертаємо void
      }

      // Перетворення документів у масив з конкретним типом
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data() as Message); // Перетворюємо дані в тип Message
      });

      // Повертаємо масив повідомлень
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).send("Error retrieving messages");
    }
  }
);

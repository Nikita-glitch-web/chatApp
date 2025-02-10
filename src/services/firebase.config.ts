import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Додано імпорт для Storage та необхідних функцій

// Firebase конфігурація
const firebaseConfig = {
  apiKey: "AIzaSyC-QfoLiL5tkHCtDL4lf_QUmSirTYJXBqQ",
  authDomain: "chat-app-6068c.firebaseapp.com",
  projectId: "chat-app-6068c",
  storageBucket: "chat-app-6068c.appspot.com", // Виправлено storageBucket URL
  messagingSenderId: "975432713180",
  appId: "1:975432713180:web:94a76eaf6a44ba46de4519",
  measurementId: "G-J6V5GRT82M",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firebase аналітики (опціонально)
const analytics = getAnalytics(app);

// Ініціалізація Firebase Functions
const functions = getFunctions(app);

// Ініціалізація Firestore, Auth і Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Експортуємо Storage

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using Firebase Authentication.
 * @returns {Promise} - Returns a promise with user credentials or throws an error.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user; // Access the signed-in user's info
    console.log("Успішний вхід:", user);
    return user; // Return user info if needed
  } catch (error) {
    console.error("Помилка входу через Google:", error);
    throw error; // Rethrow the error for error handling in the UI
  }
};

/**
 * Sign out the current user.
 * @returns {Promise} - Resolves when the user is successfully signed out.
 */
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("Користувач успішно вийшов");
  } catch (error) {
    console.error("Помилка при виході:", error);
    throw error;
  }
};

// Серверні функції
export const getMessages = httpsCallable(functions, "getMessages");
export const addMessage = httpsCallable(functions, "addMessage");

// Функція для створення чату
export const createChat = async (userId1: string, userId2: string) => {
  try {
    const chatRef = await addDoc(collection(db, "chats"), {
      users: [userId1, userId2], // Список учасників чату
      createdAt: new Date(),
    });
    console.log("Chat created with ID: ", chatRef.id);
    return chatRef.id; // Повертаємо chatId для подальших дій
  } catch (error) {
    console.error("Error creating chat: ", error);
  }
};

// Функція для додавання повідомлення в чат
export const addMessageToChat = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  try {
    const messageRef = await addDoc(
      collection(db, "chats", chatId, "messages"),
      {
        senderId,
        text,
        timestamp: new Date(),
      }
    );
    console.log("Message sent with ID: ", messageRef.id);
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The path in Firebase Storage where the file will be stored.
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileRef = ref(storage, path); // Create a reference to the location in storage
  try {
    // Upload the file to the specified path
    await uploadBytes(fileRef, file);
    console.log("Файл успішно завантажено");

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(fileRef);
    console.log("URL завантаженого файлу:", downloadURL);
    return downloadURL; // Return the URL so it can be used to display the file
  } catch (error) {
    console.error("Помилка при завантаженні файлу:", error);
    throw error; // Rethrow the error to handle it later
  }
};

export { app, analytics };

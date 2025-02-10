import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "./firebase.config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

const addUserToFirestore = async (user: User, additionalData = {}) => {
  try {
    console.log("Adding user to Firestore:", user);
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      ...additionalData, // додаткові дані користувача
    });
    console.log("User added to Firestore successfully");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw new Error("Error adding user to Firestore");
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await addUserToFirestore(user); // Додаємо користувача в Firestore
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Error registering user");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await addUserToFirestore(user);
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Error logging in user");
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Error logging out");
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("onAuthStateChanged fired, user:", user);
        unsubscribe(); // ВАЖЛИВО: відписуємось, щоб уникнути зависання
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      (error) => {
        console.error("Error in onAuthStateChanged:", error);
        reject(error);
      }
    );
  });
};

export const loginWithGoogle = async (token: string) => {
  try {
    const credential = GoogleAuthProvider.credential(token);
    const { user } = await signInWithCredential(auth, credential);
    await addUserToFirestore(user); // Додаємо користувача в Firestore
    return user;
  } catch (error) {
    console.error("Google login failed:", error);
    throw new Error("Google login failed");
  }
};

export const signUpWithGoogle = async (token: string) => {
  try {
    const credential = GoogleAuthProvider.credential(token);
    const { user } = await signInWithCredential(auth, credential);
    await addUserToFirestore(user); // Додаємо користувача в Firestore
    return user;
  } catch (error) {
    console.error("Google sign-up failed:", error);
    throw new Error("Google sign-up failed");
  }
};

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
    console.log(user);
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      ...additionalData, // додаткові дані користувача
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user to Firestore: ", error);
    throw error;
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
    console.error("Error registering user: ", error);
    throw error;
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
    console.error("Error logging in user: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
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
    throw error;
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
    throw error;
  }
};

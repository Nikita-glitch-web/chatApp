import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

export const fetchUserProfile = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
};

export const uploadAvatar = async (userId: string, file: File) => {
  const storageRef = ref(storage, `avatars/${userId}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  await createOrUpdateUserProfile(userId, { avatar: downloadURL });

  return downloadURL;
};

export const updateUserProfile = async (
  userId: string,
  profileData: { firstName?: string; lastName?: string; bio?: string }
) => {
  await createOrUpdateUserProfile(userId, profileData);
};

export const createUserProfile = async (
  userId: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
  }
) => {
  const userDocRef = doc(db, "users", userId);
  const defaultProfile = {
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
    ...profileData,
  };
  await setDoc(userDocRef, defaultProfile);
};

export const createOrUpdateUserProfile = async (
  userId: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
  }
) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    await updateDoc(userDocRef, profileData);
  } else {
    await createUserProfile(userId, profileData);
  }
};

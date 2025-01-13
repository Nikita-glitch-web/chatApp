import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC-QfoLiL5tkHCtDL4lf_QUmSirTYJXBqQ",
  authDomain: "chat-app-6068c.firebaseapp.com",
  projectId: "chat-app-6068c",
  storageBucket: "chat-app-6068c.firebasestorage.app",
  messagingSenderId: "975432713180",
  appId: "1:975432713180:web:94a76eaf6a44ba46de4519",
  measurementId: "G-J6V5GRT82M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

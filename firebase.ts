// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC24FA2mkS99DeFZwuTWZn5c76UZRTgvb8",
  authDomain: "chat-with-pdf-322a0.firebaseapp.com",
  projectId: "chat-with-pdf-322a0",
  storageBucket: "chat-with-pdf-322a0.appspot.com",
  messagingSenderId: "34296705723",
  appId: "1:34296705723:web:1ca9a3303f9529d37eaf9e",
  measurementId: "G-1158LZD67H"
};

// Initialize Firebase

const app = getApps().length == 0 ? initializeApp(firebaseConfig) :  getApp();
const db = getFirestore(app);
const storage = getStorage(app);

const analytics = getAnalytics(app);

export { db, storage }
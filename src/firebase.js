// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // <-- ADD THIS

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaAQpc3FhzbIu450gLvPBiWsw80WoKd08",
  authDomain: "birthday-voting-game.firebaseapp.com",
  databaseURL: "https://birthday-voting-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "birthday-voting-game",
  storageBucket: "birthday-voting-game.firebasestorage.app",
  messagingSenderId: "556117631627",
  appId: "1:556117631627:web:ec28376e710ceecfdc2a8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


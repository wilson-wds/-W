
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace the placeholder values with your actual Firebase project configuration.
// You can find this in your Firebase project console under Project settings > General.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "split-335bb.firebaseapp.com",
  projectId: "split-335bb",
  storageBucket: "split-335bb.appspot.com",
  messagingSenderId: "439381474128",
  appId: "YOUR_APP_ID", // Replace with your actual App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

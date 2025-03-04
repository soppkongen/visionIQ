import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGKbfQ8dJQ4vChYDHliKCnupFp7ZuoCP0",
  authDomain: "visioniq-747ae.firebaseapp.com",
  projectId: "visioniq-747ae",
  storageBucket: "visioniq-747ae.firebasestorage.app",
  messagingSenderId: "57941499671",
  appId: "1:57941499671:web:8771fb1fe65a677369a152",
  measurementId: "G-PW959Q3QRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

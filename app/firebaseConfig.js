import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBUm9_M2W5FMh48hUroq89ze7MugS0CVuM",
  authDomain: "minimal-weather-app-a7e9e.firebaseapp.com",
  projectId: "minimal-weather-app-a7e9e",
  storageBucket: "minimal-weather-app-a7e9e.appspot.com",
  messagingSenderId: "642791299385",
  appId: "1:642791299385:web:a772f62cfd5086713270e8",
  measurementId: "G-7761CZ8JD9",
};

let db, functions;
export async function init() {
  await initializeApp(firebaseConfig);
  db = getFirestore();
  functions = getFunctions();
  if (__DEV__) {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(functions, "localhost", 5001);
  }
}

export { db, functions };

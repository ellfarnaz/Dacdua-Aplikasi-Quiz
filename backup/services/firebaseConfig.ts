// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD7MD99GDNFANCWxka_I4HSZ0SukavhrNE",
  authDomain: "dacdua-22956.firebaseapp.com",
  projectId: "dacdua-22956",
  storageBucket: "dacdua-22956.appspot.com",
  messagingSenderId: "1075527403087",
  appId: "1:1075527403087:web:9b68a5ca588db56df8cc3a",
  measurementId: "G-FVQFXT2B56",
};

const app = initializeApp(firebaseConfig);

// Inisialisasi Auth dengan AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };

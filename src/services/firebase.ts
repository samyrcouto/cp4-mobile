import { getApp, getApps, initializeApp } from "firebase/app";

import {
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    type Auth,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMMv3JjNtUG9vDo0mMTpT_IKaarOgezSM",
  authDomain: "cp4-mobile-ae68f.firebaseapp.com",
  projectId: "cp4-mobile-ae68f",
  storageBucket: "cp4-mobile-ae68f.firebasestorage.app",
  messagingSenderId: "267749877550",
  appId: "1:267749877550:web:b86a209a1641c645a8bcbf",
  measurementId: "G-69YHF0CFVR",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };

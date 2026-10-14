import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Public web-app config only. NEVER put Firebase Admin / service-account credentials in the frontend.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const isFirebaseConfigured = () => Object.values(firebaseConfig).every(Boolean) && Boolean(VAPID_KEY);
export const getFirebaseApp = () => (getApps().length ? getApp() : initializeApp(firebaseConfig));

/** Returns a Messaging instance, or null when the browser can't do web push. */
export async function getMessagingIfSupported() {
  try {
    if (!(await isSupported())) return null;
    return getMessaging(getFirebaseApp());
  } catch {
    return null;
  }
}

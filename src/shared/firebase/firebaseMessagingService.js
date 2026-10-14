import { deleteToken, getToken, onMessage } from "firebase/messaging";
// UNVERIFIED import: see delivery/service/deliveryApi.js
import  api  from "../config/api";
import { DELIVERY_ENDPOINTS, NOTIFICATION_TYPES, buildFcmRegistrationBody, parseDeliveryNotification } from "../config/deliveryContracts";
import { toApiError } from "../util/apiError";
import { VAPID_KEY, firebaseConfig, getMessagingIfSupported, isFirebaseConfigured } from "./firebase";

const SW_URL = "/firebase-messaging-sw.js";
const SW_SCOPE = "/firebase-cloud-messaging-push-scope"; // Firebase's default scope; avoids clashing with other service workers
const tokenKey = (userId) => `fcm:registered:${userId}`;
const DEDUPE_MS = 60000;

const fail = (status, message) => ({ status, message });
const browserCapable = () => typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;

export const getPermission = () => (browserCapable() ? Notification.permission : "unsupported");

// The SW can't read Vite env, so the public config is passed on its URL.
function registerServiceWorker() {
  const qs = new URLSearchParams(firebaseConfig).toString();
  return navigator.serviceWorker.register(`${SW_URL}?${qs}`, { scope: SW_SCOPE });
}

async function registerCurrentToken(messaging, userId) {
  try {
    const registration = await registerServiceWorker();
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
    if (!token) return fail("registration_failed", "The browser didn't return a notification token.");
    if (localStorage.getItem(tokenKey(userId)) !== token) {
      await api.post(DELIVERY_ENDPOINTS.registerFcmToken, buildFcmRegistrationBody(token));
      localStorage.setItem(tokenKey(userId), token);
    }
    // "enabled" means this browser is registered with the backend - not that a notification was displayed.
    return { status: "enabled" };
  } catch (e) {
    // Drop the token so the next attempt mints a fresh one (covers expired/invalid tokens).
    try { await deleteToken(messaging); } catch { /* ignore */ }
    localStorage.removeItem(tokenKey(userId));
    return fail("registration_failed", toApiError(e).message || "Couldn't register this browser for notifications.");
  }
}

/** Must be called from a user gesture (button click). */
export async function enableNotifications(userId) {
  if (!isFirebaseConfigured()) return fail("unconfigured", "Push notifications aren't set up for this app yet.");
  if (!browserCapable()) return fail("unsupported", "This browser doesn't support push notifications.");
  const messaging = await getMessagingIfSupported();
  if (!messaging) return fail("unsupported", "This browser doesn't support push notifications.");

  let permission;
  try { permission = await Notification.requestPermission(); } catch { permission = Notification.permission; }
  if (permission === "denied") return fail("denied", "Notifications are blocked. Allow them in your browser's site settings, then try again.");
  if (permission !== "granted") return fail("dismissed", "Notification permission wasn't granted.");
  return registerCurrentToken(messaging, userId);
}

/** Silent: no prompt. Re-registers when the token rotated (or was rejected). Call on app start if permission is already granted. */
export async function syncFcmRegistration(userId) {
  if (!userId || !isFirebaseConfigured() || getPermission() !== "granted") return null;
  const messaging = await getMessagingIfSupported();
  return messaging ? registerCurrentToken(messaging, userId) : null;
}

/** Local cleanup for logout. (Add a backend unregister call here if the backend exposes one.) */
export async function clearLocalToken(userId) {
  localStorage.removeItem(tokenKey(userId));
  const messaging = await getMessagingIfSupported();
  if (messaging) { try { await deleteToken(messaging); } catch { /* ignore */ } }
}

// ---- foreground messages: one onMessage registration shared by all subscribers ----
const listeners = new Set();
const seen = new Map();
let unsubscribeFcm = null;
let starting = false;

const isDuplicate = (evt) => {
  const now = Date.now();
  for (const [k, t] of seen) if (now - t > DEDUPE_MS) seen.delete(k);
  const key = evt.messageId || `${evt.type}:${evt.orderId}`;
  if (seen.has(key)) return true;
  seen.set(key, now);
  return false;
};

function ensureForegroundListener() {
  if (unsubscribeFcm || starting) return;
  starting = true;
  getMessagingIfSupported()
    .then((messaging) => {
      if (!messaging || !listeners.size || unsubscribeFcm) return;
      unsubscribeFcm = onMessage(messaging, (payload) => {
        const evt = parseDeliveryNotification(payload);
        if (isDuplicate(evt)) return;
        listeners.forEach((l) => l(evt));
      });
    })
    .finally(() => { starting = false; });
}

/** Returns a synchronous unsubscribe function. Safe to call from React effects. */
export function subscribeToDeliveryNotifications(listener) {
  listeners.add(listener);
  ensureForegroundListener();
  return () => {
    listeners.delete(listener);
    if (!listeners.size && unsubscribeFcm) {
      unsubscribeFcm();
      unsubscribeFcm = null;
    }
  };
}

export const isNearbyEvent = (evt) => evt?.type === NOTIFICATION_TYPES.NEARBY;

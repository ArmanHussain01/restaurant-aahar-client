/* Firebase background messaging. Public web config arrives via the registration URL query string. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const p = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: p.get("apiKey"),
  authDomain: p.get("authDomain"),
  projectId: p.get("projectId"),
  storageBucket: p.get("storageBucket"),
  messagingSenderId: p.get("messagingSenderId"),
  appId: p.get("appId"),
});
const messaging = firebase.messaging();

// Route used by the customer tracking page (keep in sync with CustomerRoute).
const trackingPath = (orderId) => (orderId ? `/track-order/${orderId}` : "/");

messaging.onBackgroundMessage((payload) => {
  // If the payload has a `notification` block, FCM already displays it - showing again would duplicate it.
  if (payload.notification) return;
  const d = payload.data || {};
  const nearby = d.type === "DELIVERY_NEARBY"; // UNVERIFIED type string - keep in sync with deliveryContracts.js
  const title = d.title || (nearby ? "Your order is almost here!" : "Order update");
  const body = d.body || (nearby ? "Your delivery partner is within 100 meters." : "");
  self.registration.showNotification(title, {
    body,
    tag: d.orderId ? `delivery-${d.orderId}-${d.type || "update"}` : undefined, // same event never stacks
    data: { orderId: d.orderId },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = self.location.origin + trackingPath(event.notification.data && event.notification.data.orderId);
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => c.url.startsWith(self.location.origin));
      if (open) return open.navigate(url).then((c) => c && c.focus());
      return clients.openWindow(url);
    }),
  );
});

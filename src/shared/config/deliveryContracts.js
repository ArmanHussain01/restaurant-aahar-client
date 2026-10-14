export const DELIVERY_ENDPOINTS = {
  accept: (id) => `/api/deliveries/${id}/accept`,
  pickup: (id) => `/api/deliveries/${id}/pickup`,
  outForDelivery: (id) => `/api/deliveries/${id}/out-for-delivery`,
  deliver: (id) => `/api/deliveries/${id}/deliver`,
  location: (id) => `/api/deliveries/${id}/location`,
  byId: (id) => `/api/deliveries/${id}`,

  myDeliveries: "/api/deliveries/my",

  trackByOrder: (orderId) => `/api/order/${orderId}/tracking`, 
  registerFcmToken: "/api/notifications/fcm-token", 
};


export const buildLocationBody = ({ latitude, longitude }) => ({
  latitude: Number(Number(latitude).toFixed(6)),
  longitude: Number(Number(longitude).toFixed(6)),
});


export const buildFcmRegistrationBody = (token) => ({ token, platform: "WEB" });


export const NOTIFICATION_TYPES = { NEARBY: "DELIVERY_NEARBY" };
export const NEARBY_TITLE = "Your order is almost here!";
export const isNearbyNotification = (evt) =>
  evt?.type === NOTIFICATION_TYPES.NEARBY || evt?.title === NEARBY_TITLE;

export function parseDeliveryNotification(payload) {
  const data = payload?.data ?? {};
  return {
    messageId: payload?.messageId ?? payload?.fcmMessageId ?? null,
    type: data.type ?? null,
    deliveryId: data.deliveryId ?? null,
    orderId: data.orderId ?? null,
    title: payload?.notification?.title ?? data.title ?? null,
    body: payload?.notification?.body ?? data.body ?? null,
  };
}

const pick = (...v) => v.find((x) => x !== undefined && x !== null && x !== "");

export function formatAddress(a) {
  if (!a) return "";
  if (typeof a === "string") return a;
  return [
    pick(a.streetAddress, a.street, a.addressLine1),
    a.city,
    a.state,
    pick(a.postalCode, a.pincode, a.zip),
  ]
    .filter(Boolean)
    .join(", ");
}

const ts = (v) =>
  typeof v === "string" ? v.replace(/(\.\d{3})\d+/, "$1") : (v ?? null);


export function normalizeDelivery(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    id: pick(raw.id, raw.deliveryId),
    orderId: raw.orderId,
    deliveryPartnerId: pick(raw.deliveryPartnerId, raw.partnerId),
    status: pick(raw.status, raw.deliveryStatus),
    orderStatus: raw.orderStatus,
    pickupLatitude: raw.pickupLatitude,
    pickupLongitude: raw.pickupLongitude,
    customerLatitude: raw.customerLatitude,
    customerLongitude: raw.customerLongitude,
    latitude: raw.currentLatitude,
    longitude: raw.currentLongitude,
    assignedAt: ts(raw.assignedAt),
    acceptedAt: ts(raw.acceptedAt),
    pickedUpAt: ts(raw.pickedUpAt),
    deliveredAt: ts(raw.deliveredAt),
    // Optional - only if you add them to DeliveryResponse:
    outForDeliveryAt: ts(raw.outForDeliveryAt),
    locationUpdatedAt: ts(pick(raw.locationUpdatedAt, raw.lastLocationUpdate)),
    restaurantName: raw.restaurantName,
    restaurantAddress: formatAddress(raw.restaurantAddress),
    customerAddress: formatAddress(
      pick(raw.deliveryAddress, raw.customerAddress),
    ),
    items: (raw.items ?? []).map((i) => ({
      name: pick(i.name, i.foodName) ?? "Item",
      quantity: i.quantity ?? 1,
    })),
    totalAmount: raw.totalAmount,
    partnerName: raw.partnerName,
    partnerPhone: raw.partnerPhone,
    expectedDeliveryAt: ts(raw.expectedDeliveryAt),
  };
}

export const fromOrder = (o) =>
  !o
    ? {}
    : {
        restaurantName: o.restaurant?.name,
        restaurantAddress: formatAddress(o.restaurant?.address),
        customerAddress: formatAddress(o.deliveryAddress),
        items: (o.items ?? []).map((i) => ({
          name: i.food?.name ?? "Item",
          quantity: i.quantity ?? 1,
        })),
        totalAmount: o.totalAmount ?? o.totalPrice,
        orderStatus: o.orderStatus,
      };

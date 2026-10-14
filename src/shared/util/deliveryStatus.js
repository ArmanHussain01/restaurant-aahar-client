export const DELIVERY_STATUS = {
  ASSIGNED: "ASSIGNED",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
};

export const STATUS_ORDER = Object.values(DELIVERY_STATUS);

export const STATUS_META = {
  ASSIGNED: { label: "Assigned", color: "warning" },
  ACCEPTED: { label: "Accepted", color: "warning" },
  PICKED_UP: { label: "Picked up", color: "warning" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", color: "warning" },
  DELIVERED: { label: "Delivered", color: "success" },
};
export const getStatusMeta = (s) =>
  STATUS_META[s] ?? { label: s ? String(s).replaceAll("_", " ") : "Unknown", color: "error" };

// The backend remains the source of truth; this only decides which button to show.
export const NEXT_ACTION = {
  ASSIGNED: { action: "accept", label: "Accept delivery", confirm: "Accept this delivery? You'll be responsible for picking it up." },
  ACCEPTED: { action: "pickup", label: "Mark as picked up", confirm: "Confirm you have collected the order from the restaurant." },
  PICKED_UP: { action: "out-for-delivery", label: "Start delivery", confirm: "Start delivery? Your location will be shared with the customer while you're on the way." },
  OUT_FOR_DELIVERY: { action: "deliver", label: "Mark as delivered", confirm: "Confirm the order has been handed to the customer. This can't be undone." },
};

export const isActiveStatus = (s) =>
  [DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.PICKED_UP, DELIVERY_STATUS.OUT_FOR_DELIVERY].includes(s);

export const formatDateTime = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
};

export const timeAgo = (v) => {
  if (!v) return null;
  const t = new Date(v).getTime();
  if (Number.isNaN(t)) return null;
  const secs = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  return `${Math.floor(secs / 3600)} h ago`;
};

export const mapsDirectionsUrl = (address) =>
  address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : null;

export const formatCoords = (lat, lng, decimals = 4) => {
  if (lat == null || lng == null) return null;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (Number.isNaN(numLat) || Number.isNaN(numLng)) return null;
  return `${numLat.toFixed(decimals)}, ${numLng.toFixed(decimals)}`;
};
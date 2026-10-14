import api from "../../shared/config/api";
import { DELIVERY_ENDPOINTS as E, buildLocationBody, normalizeDelivery } from "../../shared/config/deliveryContracts";
import { authHeaders } from "../../shared/util/authToken";

const TRANSITIONS = {
  accept: E.accept,
  pickup: E.pickup,
  "out-for-delivery": E.outForDelivery,
  deliver: E.deliver,
};

export async function getMyDeliveries(jwt) {
  const { data } = await api.get(E.myDeliveries, authHeaders(jwt));
  const list = Array.isArray(data) ? data : data?.content ?? data?.deliveries ?? [];
  return list.map(normalizeDelivery).filter(Boolean);
}

/** Returns the updated delivery if the backend sent one, otherwise null (caller refetches). */
export async function transitionDelivery(deliveryId, action, jwt) {
  const url = TRANSITIONS[action]?.(deliveryId);
  if (!url) throw new Error(`Unknown delivery action: ${action}`);
  const { data } = await api.patch(url, {}, authHeaders(jwt));
  return normalizeDelivery(data);
}

export async function sendLocation(deliveryId, coords, jwt) {
  await api.patch(E.location(deliveryId), buildLocationBody(coords), authHeaders(jwt));
}

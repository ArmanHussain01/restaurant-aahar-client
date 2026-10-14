import api from "../../shared/config/api";
import { authHeaders } from "../../shared/util/authToken";
import {
  DELIVERY_ENDPOINTS,
  normalizeDelivery,
} from "../../shared/config/deliveryContracts";

export async function getOrderTracking(orderId, jwt) {
  const { data } = await api.get(
    DELIVERY_ENDPOINTS.trackByOrder(orderId),
    authHeaders(jwt),
  );
  return normalizeDelivery(data);
}

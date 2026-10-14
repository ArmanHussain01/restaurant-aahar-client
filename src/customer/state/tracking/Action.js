import * as T from "./ActionTypes";
import { getOrderTracking } from "../../service/trackingApi";
import { toApiError } from "../../../shared/util/apiError";

export const resetTracking = (orderId) => ({ type: T.TRACKING_RESET, payload: { orderId } });

export const fetchOrderTracking =
  (orderId, jwt, { silent = false } = {}) =>
  async (dispatch) => {
    dispatch({ type: T.TRACKING_REQUEST, payload: { orderId, silent } });
    try {
      const data = await getOrderTracking(orderId, jwt);
      dispatch({ type: T.TRACKING_SUCCESS, payload: { orderId, data } });
    } catch (e) {
      dispatch({ type: T.TRACKING_FAILURE, payload: { orderId, error: toApiError(e), silent } });
    }
  };

export const nearbyEventReceived = ({ orderId, title, body }) => ({
  type: T.TRACKING_NEARBY_EVENT,
  payload: { orderId: String(orderId), title, body, receivedAt: Date.now() },
});
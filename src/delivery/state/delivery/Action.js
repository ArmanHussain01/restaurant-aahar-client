import * as T from "./ActionTypes";
import * as deliveryApi from "../../service/deliveryApi";
import { toApiError } from "../../../shared/util/apiError";

let listSeq = 0; // ignore responses of superseded list requests (stale state)

export const fetchMyDeliveries =
  (jwt, { silent = false } = {}) =>
  async (dispatch) => {
    const seq = ++listSeq;
    dispatch({ type: T.FETCH_DELIVERIES_REQUEST, payload: { silent } });
    try {
      const deliveries = await deliveryApi.getMyDeliveries(jwt);
      if (seq === listSeq) dispatch({ type: T.FETCH_DELIVERIES_SUCCESS, payload: deliveries });
    } catch (e) {
      if (seq === listSeq) dispatch({ type: T.FETCH_DELIVERIES_FAILURE, payload: toApiError(e) });
    }
  };

/**
 * action: "accept" | "pickup" | "out-for-delivery" | "deliver"
 * Not optimistic: state changes only from the backend response, then the list is refetched to reconcile.
 */
export const performDeliveryAction = (deliveryId, action, jwt) => async (dispatch, getState) => {
  if (getState().delivery.inFlight[deliveryId]) return { ok: false, duplicate: true };
  dispatch({ type: T.DELIVERY_ACTION_REQUEST, payload: { deliveryId } });
  try {
    const delivery = await deliveryApi.transitionDelivery(deliveryId, action, jwt);
    dispatch({ type: T.DELIVERY_ACTION_SUCCESS, payload: { deliveryId, delivery } });
    dispatch(fetchMyDeliveries(jwt, { silent: true }));
    return { ok: true };
  } catch (e) {
    const error = toApiError(e);
    dispatch({ type: T.DELIVERY_ACTION_FAILURE, payload: { deliveryId, error } });
    dispatch(fetchMyDeliveries(jwt, { silent: true })); // our view may be stale (e.g. 409)
    return { ok: false, error };
  }
};

export const resetDeliveryState = () => ({ type: T.DELIVERY_RESET });

import * as T from "./ActionTypes";
import { mergeDefined } from "../../../shared/util/mergeDefined";

export const initialState = {
  deliveries: [],
  loaded: false,
  loading: false,
  error: null,
  inFlight: {},
  actionError: {},
};

const omit = (obj, key) => {
  const { [key]: _removed, ...rest } = obj;
  return rest;
};

export default function deliveryReducer(
  state = initialState,
  { type, payload } = {},
) {
  switch (type) {
    case T.FETCH_DELIVERIES_REQUEST:
      return {
        ...state,
        loading: !payload?.silent,
        error: payload?.silent ? state.error : null,
      };
    case T.FETCH_DELIVERIES_SUCCESS: {
      const deliveries = payload.map((d) => {
        const old = state.deliveries.find((x) => String(x.id) === String(d.id));
        return old ? mergeDefined(old, d) : d;
      });
      return {
        ...state,
        deliveries,
        loaded: true,
        loading: false,
        error: null,
      };
    }
    case T.FETCH_DELIVERIES_FAILURE:
      return { ...state, loading: false, error: payload };
    case T.DELIVERY_ACTION_REQUEST:
      return {
        ...state,
        inFlight: { ...state.inFlight, [payload.deliveryId]: true },
        actionError: omit(state.actionError, payload.deliveryId),
      };
    case T.DELIVERY_ACTION_SUCCESS: {
      const d = payload.delivery;
      const deliveries =
        d?.id != null && d?.status
          ? state.deliveries.map((x) =>
              String(x.id) === String(d.id) ? mergeDefined(x, d) : x,
            )
          : state.deliveries;
      return {
        ...state,
        deliveries,
        inFlight: omit(state.inFlight, payload.deliveryId),
      };
    }
    case T.DELIVERY_ACTION_FAILURE:
      return {
        ...state,
        inFlight: omit(state.inFlight, payload.deliveryId),
        actionError: {
          ...state.actionError,
          [payload.deliveryId]: payload.error,
        },
      };
    case T.DELIVERY_RESET:
      return initialState;
    default:
      return state;
  }
}

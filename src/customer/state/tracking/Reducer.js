import * as T from "./ActionTypes";
import { mergeDefined } from "../../../shared/util/mergeDefined";

export const initialState = {
  current: { orderId: null, data: null, loading: false, error: null },
  nearby: {},
};
const ACCESS_ERRORS = [401, 403, 404];

export default function trackingReducer(
  state = initialState,
  { type, payload } = {},
) {
  const cur = state.current;
  const stale =
    payload?.orderId != null && String(payload.orderId) !== String(cur.orderId);
  switch (type) {
    case T.TRACKING_RESET:
      return {
        ...state,
        current: {
          orderId: payload.orderId,
          data: null,
          loading: true,
          error: null,
        },
      };
    case T.TRACKING_REQUEST:
      return stale
        ? state
        : {
            ...state,
            current: { ...cur, loading: !payload.silent && !cur.data },
          };
    case T.TRACKING_SUCCESS:
      return stale
        ? state
        : {
            ...state,
            current: {
              ...cur,
              data: cur.data
                ? mergeDefined(cur.data, payload.data)
                : payload.data,
              loading: false,
              error: null,
            },
          };
    case T.TRACKING_FAILURE: {
      if (stale) return state;
      const denied = ACCESS_ERRORS.includes(payload.error.status);
      return {
        ...state,
        current: {
          ...cur,
          loading: false,
          error: payload.error,
          data: denied || !cur.data ? null : cur.data,
        },
      };
    }
    case T.TRACKING_NEARBY_EVENT:
      return {
        ...state,
        nearby: { ...state.nearby, [payload.orderId]: payload },
      };
    default:
      return state;
  }
}

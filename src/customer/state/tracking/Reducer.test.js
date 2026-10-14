import { describe, expect, it } from "vitest";
import reducer, { initialState } from "./Reducer";
import * as T from "./ActionTypes";

describe("tracking reducer", () => {
  const start = reducer(initialState, { type: T.TRACKING_RESET, payload: { orderId: "7" } });
  it("ignores responses for a different order", () => {
    const s = reducer(start, { type: T.TRACKING_SUCCESS, payload: { orderId: "8", data: { status: "ASSIGNED" } } });
    expect(s.current.data).toBeNull();
  });
  it("wipes data on 403 so coordinates are never shown", () => {
    let s = reducer(start, { type: T.TRACKING_SUCCESS, payload: { orderId: "7", data: { latitude: 1 } } });
    s = reducer(s, { type: T.TRACKING_FAILURE, payload: { orderId: "7", error: { status: 403, message: "no" } } });
    expect(s.current.data).toBeNull();
  });
  it("keeps last data when a background poll fails on the network", () => {
    let s = reducer(start, { type: T.TRACKING_SUCCESS, payload: { orderId: "7", data: { status: "OUT_FOR_DELIVERY" } } });
    s = reducer(s, { type: T.TRACKING_FAILURE, payload: { orderId: "7", error: { status: null, message: "net" } } });
    expect(s.current.data.status).toBe("OUT_FOR_DELIVERY");
  });
});

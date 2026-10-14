import { describe, expect, it } from "vitest";
import reducer, { initialState } from "./Reducer";
import * as T from "./ActionTypes";

const d = (id, status) => ({ id, status, items: [] });

describe("delivery reducer", () => {
  it("replaces the list with the backend list", () => {
    const s = reducer(initialState, { type: T.FETCH_DELIVERIES_SUCCESS, payload: [d(1, "ASSIGNED")] });
    expect(s.deliveries).toHaveLength(1);
    expect(s.loaded).toBe(true);
  });
  it("marks an action in flight, then clears it on success using the backend response", () => {
    let s = reducer({ ...initialState, deliveries: [d(1, "ASSIGNED")] }, { type: T.DELIVERY_ACTION_REQUEST, payload: { deliveryId: 1 } });
    expect(s.inFlight[1]).toBe(true);
    s = reducer(s, { type: T.DELIVERY_ACTION_SUCCESS, payload: { deliveryId: 1, delivery: d(1, "ACCEPTED") } });
    expect(s.inFlight[1]).toBeUndefined();
    expect(s.deliveries[0].status).toBe("ACCEPTED");
  });
  it("does not change status when the backend returned no body", () => {
    const s = reducer({ ...initialState, deliveries: [d(1, "ASSIGNED")] }, { type: T.DELIVERY_ACTION_SUCCESS, payload: { deliveryId: 1, delivery: null } });
    expect(s.deliveries[0].status).toBe("ASSIGNED");
  });
  it("keeps status unchanged and stores the error on failure", () => {
    const s = reducer({ ...initialState, deliveries: [d(1, "ASSIGNED")], inFlight: { 1: true } }, { type: T.DELIVERY_ACTION_FAILURE, payload: { deliveryId: 1, error: { status: 409, message: "x" } } });
    expect(s.deliveries[0].status).toBe("ASSIGNED");
    expect(s.actionError[1].status).toBe(409);
    expect(s.inFlight[1]).toBeUndefined();
  });
});

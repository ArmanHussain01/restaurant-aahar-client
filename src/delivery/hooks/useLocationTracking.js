import { useEffect, useRef, useState } from "react";
import * as deliveryApi from "../service/deliveryApi";
import { toApiError } from "../../shared/util/apiError";
import { DELIVERY_STATUS } from "../../shared/util/deliveryStatus";

const SEND_INTERVAL_MS = 15000;
const STALE_STATUSES = [401, 403, 404, 409];
const idle = { permission: "unknown", geoError: null, sendError: null, lastSentAt: null };

/**
 * Real GPS only (watchPosition). Sends the latest fix every 15 s while the delivery is
 * OUT_FOR_DELIVERY and the tab is visible. Stops on status change, `enabled=false` or unmount.
 */
export default function useLocationTracking({ delivery, jwt, enabled = true, onStale }) {
  const deliveryId = delivery?.id;
  const active = enabled && delivery?.status === DELIVERY_STATUS.OUT_FOR_DELIVERY;
  const [state, setState] = useState(idle);
  const onStaleRef = useRef(onStale);
  onStaleRef.current = onStale;
  const jwtRef = useRef(jwt);
  jwtRef.current = jwt; // always send the latest token

  useEffect(() => {
    if (!active) {
      setState(idle);
      return undefined;
    }
    if (!("geolocation" in navigator)) {
      setState({ ...idle, permission: "unsupported", geoError: "This browser can't share your location." });
      return undefined;
    }

    let cancelled = false;
    let sending = false;
    let latest = null;
    let firstFix = true;

    const send = async () => {
      if (cancelled || sending || !latest || !jwtRef.current || document.visibilityState !== "visible") return;
      sending = true;
      try {
        await deliveryApi.sendLocation(deliveryId, latest, jwtRef.current);
        if (!cancelled) setState((s) => ({ ...s, sendError: null, lastSentAt: new Date().toISOString() }));
      } catch (e) {
        const err = toApiError(e);
        if (!cancelled) setState((s) => ({ ...s, sendError: err.message }));
        if (STALE_STATUSES.includes(err.status)) onStaleRef.current?.(err);
      } finally {
        sending = false;
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        latest = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setState((s) => (s.permission === "granted" && !s.geoError ? s : { ...s, permission: "granted", geoError: null }));
        if (firstFix) {
          firstFix = false;
          send();
        }
      },
      (err) => {
        const denied = err.code === 1;
        setState((s) => ({
          ...s,
          permission: denied ? "denied" : s.permission,
          geoError: denied
            ? "Location access is blocked. Customers can't see your live position until you allow it in your browser settings. You can still complete the delivery."
            : err.code === 3
              ? "Getting your location is taking too long. Check your GPS signal."
              : "Your position is unavailable right now.",
        }));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    const intervalId = setInterval(send, SEND_INTERVAL_MS);
    const onVisible = () => document.visibilityState === "visible" && send();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      latest = null;
    };
  }, [active, deliveryId]);

  return { active, ...state };
}

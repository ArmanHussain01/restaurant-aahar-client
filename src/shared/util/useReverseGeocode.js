import { useEffect, useState } from "react";
import { getCachedAddress, isValidCoord, reverseGeocode } from "./reverseGeocode";

export default function useReverseGeocode(latitude, longitude, enabled = true) {
  const [state, setState] = useState({ address: null, loading: false });

  useEffect(() => {
    if (!enabled || !isValidCoord(latitude, longitude)) {
      setState({ address: null, loading: false });
      return undefined;
    }
    const cached = getCachedAddress(latitude, longitude);
    if (cached) {
      setState({ address: cached, loading: false });
      return undefined;
    }
    let cancelled = false;
    setState({ address: null, loading: true });
    reverseGeocode(latitude, longitude)
      .then((address) => !cancelled && setState({ address, loading: false }))
      .catch(() => !cancelled && setState({ address: null, loading: false }));
    return () => { cancelled = true; };
  }, [enabled, latitude, longitude]);

  return state;
}
import { Skeleton } from "@mui/material";
import useReverseGeocode from "../util/useReverseGeocode";
import { formatCoords } from "../util/deliveryStatus";

export default function PlaceLabel({
  address,
  latitude,
  longitude,
  fallback = "Not provided",
}) {
  const coords = formatCoords(latitude, longitude);
  const { address: looked, loading } = useReverseGeocode(
    latitude,
    longitude,
    !address,
  );

  if (address) return <span>{address}</span>;
  if (loading)
    return (
      <Skeleton component="span" width={180} sx={{ display: "inline-block" }} />
    );
  if (looked) return <span title={coords}>{looked}</span>;
  return <span>{coords || fallback}</span>;
}

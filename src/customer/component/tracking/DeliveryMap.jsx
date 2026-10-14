import { Alert, Box, Button, Typography } from "@mui/material";
import MyLocation from "@mui/icons-material/MyLocation";
import { formatDateTime, timeAgo } from "../../../shared/util/deliveryStatus";

const STALE_MS = 2 * 60 * 1000;

export default function DeliveryMap({ latitude, longitude, updatedAt }) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return (
      <Typography variant="body2" color="text.secondary">
        Live location isn't available yet.
      </Typography>
    );
  }
  const stale =
    updatedAt && Date.now() - new Date(updatedAt).getTime() > STALE_MS;
  return (
    <Box>
      <Typography variant="body2">
        <strong>Latest position:</strong> {lat.toFixed(5)}, {lng.toFixed(5)}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 1.5 }}
      >
        {updatedAt
          ? `Updated ${timeAgo(updatedAt)} (${formatDateTime(updatedAt)})`
          : "Update time not provided"}
      </Typography>
      {stale && (
        <Alert severity="warning" sx={{ mb: 1.5 }}>
          This position may be out of date.
        </Alert>
      )}
      <Button
        size="small"
        variant="outlined"
        startIcon={<MyLocation />}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
      >
        View on map
      </Button>
    </Box>
  );
}

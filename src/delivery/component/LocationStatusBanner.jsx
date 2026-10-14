import { Alert } from "@mui/material";
import { timeAgo } from "../../shared/util/deliveryStatus";

export default function LocationStatusBanner({ tracking }) {
  if (!tracking?.active) return null;
  if (tracking.geoError)
    return (
      <Alert
        severity={
          tracking.permission === "denied" ||
          tracking.permission === "unsupported"
            ? "error"
            : "warning"
        }
        sx={{ mb: 2 }}
      >
        {tracking.geoError}
      </Alert>
    );
  if (tracking.sendError)
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Your location couldn't be sent: {tracking.sendError} We'll keep trying.
      </Alert>
    );
  return (
    <Alert severity="info" sx={{ mb: 2 }} role="status">
      {tracking.lastSentAt
        ? `Sharing your live location. Last sent ${timeAgo(tracking.lastSentAt)}.`
        : "Waiting for your first GPS position. Allow location access if your browser asks."}
    </Alert>
  );
}

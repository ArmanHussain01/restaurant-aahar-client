import { Alert, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { STATUS_ORDER, formatDateTime } from "../util/deliveryStatus";

const TIME_KEY = {
  ASSIGNED: "assignedAt",
  ACCEPTED: "acceptedAt",
  PICKED_UP: "pickedUpAt",
  OUT_FOR_DELIVERY: "outForDeliveryAt",
  DELIVERED: "deliveredAt",
};

const LABELS = {
  partner: { ASSIGNED: "Assigned", ACCEPTED: "Accepted", PICKED_UP: "Picked up from restaurant", OUT_FOR_DELIVERY: "Out for delivery", DELIVERED: "Delivered" },
  customer: { ASSIGNED: "Delivery partner assigned", ACCEPTED: "Partner accepted your order", PICKED_UP: "Order picked up", OUT_FOR_DELIVERY: "On the way", DELIVERED: "Delivered" },
};

/** Vertical timeline. `delivery` is a normalized delivery; only milestones the backend timestamps show times. */
export default function DeliveryStatusTimeline({ delivery, variant = "partner" }) {
  const idx = STATUS_ORDER.indexOf(delivery?.status);
  if (idx === -1) {
    return <Alert severity="warning">Status "{delivery?.status ?? "unknown"}" isn't part of the normal delivery flow.</Alert>;
  }
  return (
    <Stepper activeStep={idx + 1} orientation="vertical" aria-label="Delivery progress">
      {STATUS_ORDER.map((s, i) => {
        const time = formatDateTime(delivery[TIME_KEY[s]]);
        return (
          <Step key={s} completed={i <= idx}>
            <StepLabel optional={time ? <Typography variant="caption">{time}</Typography> : null}>
              {LABELS[variant][s]}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}

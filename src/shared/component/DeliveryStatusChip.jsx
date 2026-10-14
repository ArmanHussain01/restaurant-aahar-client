import { Chip } from "@mui/material";
import { getStatusMeta } from "../util/deliveryStatus";

export default function DeliveryStatusChip({ status, size = "small" }) {
  const { label, color } = getStatusMeta(status);
  return <Chip size={size} label={label} color={color} variant={color === "success" ? "filled" : "outlined"} />;
}

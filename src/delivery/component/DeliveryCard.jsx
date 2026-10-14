import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import DeliveryStatusChip from "../../shared/component/DeliveryStatusChip";
import DeliveryActionButton from "./DeliveryActionButton";
import { formatCoords, formatDateTime } from "../../shared/util/deliveryStatus";

const Row = ({ icon, label, children }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box sx={{ color: "text.secondary", pt: 0.25 }} aria-hidden>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{children || "Not provided"}</Typography>
    </Box>
  </Stack>
);

export default function DeliveryCard({ delivery }) {
  const summary = delivery.items
    .slice(0, 3)
    .map((i) => `${i.quantity}× ${i.name}`)
    .join(", ");
  const extra = delivery.items.length - 3;
  const assigned = formatDateTime(delivery.assignedAt);
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        transition: "box-shadow .2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Order #{delivery.orderId ?? delivery.id}
          </Typography>
          <DeliveryStatusChip status={delivery.status} />
        </Stack>
        <Stack spacing={1.5}>
          <Row
            icon={<StorefrontOutlined fontSize="small" />}
            label={`Pickup · ${delivery.restaurantName ?? "Restaurant"}`}
          >
            {delivery.restaurantAddress ||
              formatCoords(delivery.pickupLatitude, delivery.pickupLongitude)}
          </Row>
          <Row icon={<PlaceOutlined fontSize="small" />} label="Deliver to">
            {delivery.customerAddress ||
              formatCoords(
                delivery.customerLatitude,
                delivery.customerLongitude,
              )}
          </Row>
          {summary && (
            <Typography variant="body2" color="text.secondary">
              {summary}
              {extra > 0 ? ` +${extra} more` : ""}
            </Typography>
          )}
          {assigned && (
            <Typography variant="caption" color="text.secondary">
              Assigned {assigned}
            </Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Button
          component={RouterLink}
          to={`/delivery/${delivery.id}`}
          size="small"
        >
          View details
        </Button>
        <DeliveryActionButton delivery={delivery} size="small" />
      </CardActions>
    </Card>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NavigationOutlined from "@mui/icons-material/NavigationOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeliveryStatusChip from "../../shared/component/DeliveryStatusChip";
import DeliveryStatusTimeline from "../../shared/component/DeliveryStatusTimeline";
import DeliveryActionButton from "./DeliveryActionButton";
import { fetchMyDeliveries } from "../state/delivery/Action";
import { selectJwt } from "../../shared/util/authToken";
import PlaceLabel from "../../shared/component/PlaceLabel";
import {
  selectActionError,
  selectDeliveryById,
} from "../state/delivery/selectors";
import {
  DELIVERY_STATUS as S,
  formatCoords,
  formatDateTime,
  mapsDirectionsUrl,
} from "../../shared/util/deliveryStatus";

const Place = ({ title, name, address, navUrl }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
    <CardContent>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      {name && (
        <Typography variant="subtitle1" fontWeight={600}>
          {name}
        </Typography>
      )}
      <Typography variant="body2" sx={{ mb: 2 }}>
        {address || "Address not provided"}
      </Typography>
      {navUrl && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<NavigationOutlined />}
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Maps
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function DeliveryDetails() {
  const { deliveryId } = useParams();
  const dispatch = useDispatch();
  const jwt = useSelector(selectJwt);
  const delivery = useSelector((s) => selectDeliveryById(s, deliveryId));
  const { loaded, loading } = useSelector((s) => s.delivery);
  const actionError = useSelector((s) => selectActionError(s, deliveryId));

  useEffect(() => {
    if (!loaded) dispatch(fetchMyDeliveries(jwt)); // page refresh restores state from the backend
  }, [loaded, dispatch, jwt]);

  const back = (
    <Button
      component={RouterLink}
      to="/delivery/active"
      startIcon={<ArrowBack />}
      sx={{ mb: 2 }}
    >
      Back to deliveries
    </Button>
  );

  if (!loaded && loading)
    return (
      <>
        {back}
        <Skeleton variant="rounded" height={320} />
      </>
    );
  if (!delivery)
    return (
      <>
        {back}
        <Alert severity="warning">
          This delivery isn't in your list. It may have been reassigned.
        </Alert>
      </>
    );

  const done = delivery.status === S.DELIVERED;
  return (
    <>
      {back}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        mb={2}
      >
        <Typography variant="h5" fontWeight={600}>
          Order #{delivery.orderId ?? delivery.id}
        </Typography>
        <DeliveryStatusChip status={delivery.status} size="medium" />
      </Stack>

      {done && (
        <Alert
          icon={<CheckCircleOutlinedIcon />}
          severity="success"
          sx={{ mb: 2 }}
        >
          Delivered
          {formatDateTime(delivery.deliveredAt)
            ? ` on ${formatDateTime(delivery.deliveredAt)}`
            : ""}
          . Location sharing has stopped.
        </Alert>
      )}
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError.message}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        <Place
          title="Pickup"
          name={delivery.restaurantName}
          address={
            <PlaceLabel
              address={delivery.restaurantAddress}
              latitude={delivery.pickupLatitude}
              longitude={delivery.pickupLongitude}
              fallback="Address not provided"
            />
          }
          navUrl={
            delivery.status === S.ACCEPTED
              ? mapsDirectionsUrl({
                  latitude: delivery.pickupLatitude,
                  longitude: delivery.pickupLongitude,
                  address: delivery.restaurantAddress,
                })
              : null
          }
        />
        <Place
          title="Destination"
          address={
            <PlaceLabel
              address={delivery.customerAddress}
              latitude={delivery.customerLatitude}
              longitude={delivery.customerLongitude}
              fallback="Address not provided"
            />
          }
          navUrl={
            [S.PICKED_UP, S.OUT_FOR_DELIVERY].includes(delivery.status)
              ? mapsDirectionsUrl({
                  latitude: delivery.customerLatitude,
                  longitude: delivery.customerLongitude,
                  address: delivery.customerAddress,
                })
              : null
          }
        />
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Progress
            </Typography>
            <DeliveryStatusTimeline delivery={delivery} />
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Order summary
            </Typography>
            {delivery.items.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No items listed.
              </Typography>
            ) : (
              <Stack divider={<Divider flexItem />} spacing={1}>
                {delivery.items.map((i, k) => (
                  <Typography key={k} variant="body2">
                    {i.quantity}× {i.name}
                  </Typography>
                ))}
              </Stack>
            )}
            {delivery.assignedAt && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={2}
              >
                Assigned {formatDateTime(delivery.assignedAt)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {!done && (
        <Box sx={{ mt: 3 }}>
          <DeliveryActionButton delivery={delivery} size="large" fullWidth />
        </Box>
      )}
    </>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import DeliveryStatusChip from "../../../shared/component/DeliveryStatusChip";
import DeliveryStatusTimeline from "../../../shared/component/DeliveryStatusTimeline";
import DeliveryMap from "./DeliveryMap";
import NotificationSettings from "../notification/NotificationSettings";
import { fetchOrderTracking, resetTracking } from "../../state/tracking/Action";
import PlaceLabel from "../../../shared/component/PlaceLabel";
import { fillMissing } from "../../../shared/util/mergeDefined";
import { fromOrder } from "../../../shared/config/deliveryContracts";
import { getUsersOrders } from "../../state/order/Action";
import {
  DELIVERY_STATUS as S,
  formatDateTime,
} from "../../../shared/util/deliveryStatus";

const POLL_MS = 10000;
const TERMINAL_ERRORS = [401, 403, 404];

const Section = ({ title, children }) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default function CustomerOrderTracking() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((s) => s.tracking.current);
  const nearby = useSelector((s) => s.tracking.nearby[String(orderId)]);
  const jwt = localStorage.getItem("jwt");

  const orders = useSelector((s) => s.order?.orders);
  const orderFromStore = orders?.find((o) => String(o.id) === String(orderId));

  useEffect(() => {
    if (jwt && !orders?.length) dispatch(getUsersOrders(jwt));
  }, [jwt, orders?.length, dispatch]);

  useEffect(() => {
    dispatch(resetTracking(orderId));
    dispatch(fetchOrderTracking(orderId));
  }, [orderId, dispatch]);

  const stopPolling =
    data?.status === S.DELIVERED || TERMINAL_ERRORS.includes(error?.status);
  useEffect(() => {
    if (stopPolling) return undefined;
    const tick = () =>
      document.visibilityState === "visible" &&
      dispatch(fetchOrderTracking(orderId, { silent: true }));
    const id = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [orderId, stopPolling, dispatch]);

  useEffect(() => {
    if (nearby) dispatch(fetchOrderTracking(orderId, { silent: true }));
  }, [nearby, orderId, dispatch]);

  const back = (
    <Button
      component={RouterLink}
      to="/my-profile/orders"
      startIcon={<ArrowBack />}
      sx={{ mb: 2 }}
    >
      Back to orders
    </Button>
  );

  if (loading && !data)
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: "auto" }}>
        {back}
        <Skeleton variant="rounded" height={360} />
      </Box>
    );
  if (error && !data) {
    const denied = TERMINAL_ERRORS.includes(error.status);
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: "auto" }}>
        {back}
        <Alert
          severity={denied ? "warning" : "error"}
          action={
            !denied && (
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(fetchOrderTracking(orderId))}
              >
                Retry
              </Button>
            )
          }
        >
          {denied
            ? "We can't show tracking for this order. It may not exist, or it belongs to another account."
            : error.message}
        </Alert>
      </Box>
    );
  }
  if (!data) return null;

  const info = fillMissing(data, fromOrder(orderFromStore));

  const live = data.status === S.OUT_FOR_DELIVERY;
  const done = data.status === S.DELIVERED;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, mx: "auto" }}>
      {back}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Order #{info.orderId ?? orderId}
          </Typography>
          {info.restaurantName && (
            <Typography variant="body2" color="text.secondary">
              {info.restaurantName}
            </Typography>
          )}
        </Box>
        <DeliveryStatusChip status={info.status} size="medium" />
      </Stack>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Couldn't refresh tracking: {error.message}
        </Alert>
      )}
      {nearby && !done && (
        <Alert severity="success" role="status" sx={{ mb: 2 }}>
          <AlertTitle>{nearby.title}</AlertTitle>
          {nearby.body}
        </Alert>
      )}
      {done && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Delivered
          {formatDateTime(info.deliveredAt)
            ? ` on ${formatDateTime(info.deliveredAt)}`
            : ""}
          .
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Section title="Progress">
          <DeliveryStatusTimeline delivery={info} variant="customer" />
          {info.expectedDeliveryAt && !done && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Expected by {formatDateTime(info.expectedDeliveryAt)}
            </Typography>
          )}
        </Section>
        <Stack spacing={2}>
          {orderFromStore?.items && orderFromStore.items.length > 0 && (
            <Section title="Order Items">
              <List disablePadding>
                {orderFromStore.items.map((cartItem, index) => (
                  <Box key={cartItem.id ?? index}>
                    <ListItem disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            {cartItem.food?.name || "Item"}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Qty: {cartItem.quantity}
                          </Typography>
                        }
                      />
                      <Typography variant="body2" fontWeight={600}>
                        ₹{cartItem.totalPrice}
                      </Typography>
                    </ListItem>
                    {index < orderFromStore.items.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" fontWeight={600}>
                  Total Price
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ₹{orderFromStore.totalPrice}
                </Typography>
              </Stack>
            </Section>
          )}

          <Section title="Addresses">
            <Typography variant="caption" color="text.secondary">
              From
            </Typography>
            <Typography variant="body2" gutterBottom>
              <PlaceLabel
                address={info.restaurantAddress}
                latitude={info.pickupLatitude}
                longitude={info.pickupLongitude}
              />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Deliver to
            </Typography>
            <Typography variant="body2">
              <PlaceLabel
                address={info.customerAddress}
                latitude={info.customerLatitude}
                longitude={info.customerLongitude}
              />
            </Typography>
          </Section>
          {(info.partnerName || info.partnerPhone) && (
            <Section title="Delivery partner">
              {info.partnerName && (
                <Typography variant="body2">{info.partnerName}</Typography>
              )}
              {info.partnerPhone && (
                <Typography variant="body2">{info.partnerPhone}</Typography>
              )}
            </Section>
          )}
          {live && (
            <Section title="Live location">
              <DeliveryMap
                latitude={info.latitude}
                longitude={info.longitude}
                updatedAt={info.locationUpdatedAt}
              />
            </Section>
          )}
          {!done && (
            <Section title="Order alerts">
              <NotificationSettings />
            </Section>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
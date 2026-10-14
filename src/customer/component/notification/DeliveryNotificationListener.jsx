import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Snackbar } from "@mui/material";
import { isNearbyEvent, subscribeToDeliveryNotifications, syncFcmRegistration } from "../../../shared/firebase/firebaseMessagingService";
import { nearbyEventReceived } from "../../state/tracking/Action";
import { selectAuthUser, selectIsAuthenticated } from "../../../shared/util/authSelectors";

/**
 * Mount ONCE inside the router of the customer app. Shows foreground push events as an in-app toast
 * (FCM does not display foreground messages itself) and feeds the tracking store.
 */
export default function DeliveryNotificationListener() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authed = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const userId = user?.id ?? user?.email;
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (authed) syncFcmRegistration(userId); // silent; no-op unless permission was already granted
  }, [authed, userId]);

  useEffect(() => {
    if (!authed) return undefined;
    return subscribeToDeliveryNotifications((evt) => {
      if (!isNearbyEvent(evt) || !evt.orderId) return; // only the verified event type is surfaced
      const title = evt.title || "Your order is almost here!";
      const body = evt.body || "Your delivery partner is within 100 meters.";
      dispatch(nearbyEventReceived({ orderId: evt.orderId, title, body }));
      setToast({ orderId: evt.orderId, title, body });
    });
  }, [authed, dispatch]);

  return (
    <Snackbar open={Boolean(toast)} onClose={(_, r) => r !== "clickaway" && setToast(null)} autoHideDuration={10000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      {toast ? (
        <Alert severity="success" variant="filled" onClose={() => setToast(null)} role="status"
          action={<Button color="inherit" size="small" onClick={() => { navigate(`/track-order/${toast.orderId}`); setToast(null); }}>Track</Button>}>
          <strong>{toast.title}</strong> {toast.body}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}

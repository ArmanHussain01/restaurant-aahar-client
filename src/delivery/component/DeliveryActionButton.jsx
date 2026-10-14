import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { performDeliveryAction } from "../state/delivery/Action";
import { selectInFlight } from "../state/delivery/selectors";
import { NEXT_ACTION } from "../../shared/util/deliveryStatus";
import { selectJwt } from "../../shared/util/authToken";

export default function DeliveryActionButton({
  delivery,
  size = "medium",
  fullWidth = false,
}) {
  const dispatch = useDispatch();
  const jwt = useSelector(selectJwt);
  const busy = useSelector((s) => selectInFlight(s, delivery.id));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const next = NEXT_ACTION[delivery.status];
  if (!next) return null;

  const confirm = async () => {
    setError(null);
    const res = await dispatch(
      performDeliveryAction(delivery.id, next.action, jwt),
    );
    if (res?.ok) setOpen(false);
    else if (!res?.duplicate)
      setError(res?.error?.message ?? "Couldn't update the delivery.");
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size={size}
        fullWidth={fullWidth}
        disabled={busy}
        onClick={() => setOpen(true)}
      >
        {next.label}
      </Button>
      <Dialog
        open={open}
        onClose={busy ? undefined : () => setOpen(false)}
        aria-labelledby={`confirm-${delivery.id}`}
      >
        <DialogTitle id={`confirm-${delivery.id}`}>{next.label}?</DialogTitle>
        <DialogContent>
          <DialogContentText>{next.confirm}</DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={confirm}
            variant="contained"
            disabled={busy}
            startIcon={
              busy ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {busy ? "Updating" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

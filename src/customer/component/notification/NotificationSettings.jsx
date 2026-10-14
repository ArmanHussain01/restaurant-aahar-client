import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import { enableNotifications, getPermission } from "../../../shared/firebase/firebaseMessagingService";
import { selectAuthUser } from "../../../shared/util/authSelectors";


export default function NotificationSettings() {
  const user = useSelector(selectAuthUser);
  const [permission, setPermission] = useState(getPermission());
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const enable = async () => {
    setBusy(true);
    const res = await enableNotifications(user?.id ?? user?.email);
    setResult(res);
    setPermission(getPermission());
    setBusy(false);
  };

  if (permission === "unsupported") return <Alert severity="info">This browser can't show push notifications.</Alert>;
  if (result?.status === "enabled") return <Alert severity="success">Order alerts are on for this browser.</Alert>;

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary">Get an alert when your delivery partner is close.</Typography>
      {(permission === "denied" || (result && result.status !== "enabled")) && <Alert severity="error">{result?.message ?? "Notifications are blocked. Allow them in your browser's site settings."}</Alert>}
      <Button variant="outlined" onClick={enable} disabled={busy || permission === "denied"} startIcon={busy ? <CircularProgress size={16} /> : <NotificationsActiveOutlined />} sx={{ alignSelf: "flex-start" }}>
        Turn on order alerts
      </Button>
    </Stack>
  );
}

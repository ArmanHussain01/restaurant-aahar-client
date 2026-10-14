import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Skeleton, Typography } from "@mui/material";
import InboxOutlined from "@mui/icons-material/InboxOutlined";
import DeliveryCard from "./DeliveryCard";
import { fetchMyDeliveries } from "../state/delivery/Action";
import { selectJwt } from "../../shared/util/authToken";

const gridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, 1fr)",
    xl: "repeat(3, 1fr)",
  },
};

export default function DeliveryList({ deliveries, emptyTitle, emptyHint }) {
  const dispatch = useDispatch();
  const jwt = useSelector(selectJwt);
  const { loading, loaded, error } = useSelector((s) => s.delivery);

  if (loading && !loaded) {
    return (
      <Box sx={gridSx} aria-busy="true" aria-label="Loading deliveries">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={220} />
        ))}
      </Box>
    );
  }
  if (error && !loaded) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => dispatch(fetchMyDeliveries(jwt))}
          >
            Retry
          </Button>
        }
      >
        {error.message}
      </Alert>
    );
  }
  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Couldn't refresh: {error.message} Showing the last loaded data.
        </Alert>
      )}
      {deliveries.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <InboxOutlined sx={{ fontSize: 48, mb: 1 }} aria-hidden />
          <Typography variant="subtitle1" color="text.primary">
            {emptyTitle}
          </Typography>
          <Typography variant="body2">{emptyHint}</Typography>
        </Box>
      ) : (
        <Box sx={gridSx}>
          {deliveries.map((d) => (
            <DeliveryCard key={d.id} delivery={d} />
          ))}
        </Box>
      )}
    </>
  );
}

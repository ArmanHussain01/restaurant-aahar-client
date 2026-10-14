import { useSelector } from "react-redux";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import {
  selectActive,
  selectAssigned,
  selectHistory,
} from "../state/delivery/selectors";

export default function DeliverySummaryCards() {
  const loading = useSelector((s) => s.delivery.loading && !s.delivery.loaded);
  const items = [
    {
      label: "Assigned",
      value: useSelector(selectAssigned).length,
      color: "warning.main",
    },
    {
      label: "In progress",
      value: useSelector(selectActive).length,
      color: "warning.main",
    },
    {
      label: "Completed",
      value: useSelector(selectHistory).length,
      color: "success.main",
    },
  ];
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        mb: 3,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
      }}
    >
      {items.map((i) => (
        <Card key={i.label} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {i.label}
            </Typography>
            {loading ? (
              <Skeleton width={40} height={44} />
            ) : (
              <Typography variant="h4" fontWeight={700} sx={{ color: i.color }}>
                {i.value}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

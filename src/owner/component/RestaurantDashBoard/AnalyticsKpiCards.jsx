import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import {
  formatINR,
  formatCount,
  formatHourLabel,
} from "../../../shared/util/analyticsFormatters";

const KpiCard = ({ icon, label, value, sub }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: "12px",
      borderColor: "#e5e7eb",
      boxShadow: "none",
      height: "100%",
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box className="flex items-center gap-2 mb-2">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "8px",
            bgcolor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#374151",
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.3 }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const KpiSkeleton = () => (
  <Card
    variant="outlined"
    sx={{ borderRadius: "12px", borderColor: "#e5e7eb", boxShadow: "none" }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="circular" width={34} height={34} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="50%" height={20} />
      <Skeleton variant="text" width="70%" height={36} />
    </CardContent>
  </Card>
);

const AnalyticsKpiCards = ({ data, loading }) => {

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <KpiSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  const totalOrders = formatCount(
    data?.monthlyOrders?.reduce((sum, m) => sum + (m.orderCount || 0), 0),
  );
  const revenue = data?.revenue?.revenue ?? 0;
  const expenses = data?.expenses?.totalExpenses ?? 0;
  const profit = data?.profit?.profit ?? 0;
  const foodCostPct = data?.profit?.foodCost ?? 0;
  const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

  const peakHourEntry = (data?.hourlyOrders || []).reduce(
    (peak, curr) => (curr.orderCount > (peak?.orderCount ?? -1) ? curr : peak),
    null,
  );
  const hasOrders = totalOrders > 0;

  const cards = [
    {
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
      label: "Total Orders",
      value: formatCount(totalOrders),
    },
    {
      icon: <PaymentsOutlinedIcon fontSize="small" />,
      label: "Revenue",
      value: formatINR(revenue),
    },
    {
      icon: <RestaurantOutlinedIcon fontSize="small" />,
      label: "Food Cost",
      value: formatINR(foodCostPct),
    },
    {
      icon: <TrendingDownOutlinedIcon fontSize="small" />,
      label: "Expenses",
      value: formatINR(expenses),
    },
    {
      icon: <TrendingUpOutlinedIcon fontSize="small" />,
      label: "Net Profit",
      value: formatINR(profit),
      sub: profit < 0 ? "Loss for this period" : undefined,
    },
    {
      icon: <ShowChartOutlinedIcon fontSize="small" />,
      label: "Average Order Value",
      value: formatINR(avgOrderValue),
    },
    {
      icon: <AccessTimeOutlinedIcon fontSize="small" />,
      label: "Peak Hour",
      value:
        hasOrders && peakHourEntry ? formatHourLabel(peakHourEntry.hour) : "—",
      sub:
        hasOrders && peakHourEntry
          ? `${formatCount(peakHourEntry.orderCount)} orders`
          : "No orders yet",
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.label}>
          <KpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsKpiCards;

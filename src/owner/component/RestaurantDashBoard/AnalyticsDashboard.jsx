import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CloseIcon from "@mui/icons-material/Close";
import AnalyticsFilters from "./AnalyticsFilters";
import AnalyticsKpiCards from "./AnalyticsKpiCards";
import OrdersOverTimeChart from "./OrdersOverTimeChart";
import RevenueOverTimeChart from "./RevenueOverTimeChart";
import OrdersByHourChart from "./OrdersByHourChart";
import OrdersByCategoryChart from "./OrdersByCategoryChart";
import { downloadBusinessReport, fetchBusinessReport, fetchDashboardAnalytics } from "../../state/analytics/Action";
import {
  getPresetRange,
  getGranularity,
  formatDateLabel,
} from "../../../shared/util/analyticsFormatters";
import BusinessReportDialog from "./BusinessReportDialog";

// Static JSON data for Business Report
const reportData = {
  restaurantId: 202,
  startDate: "2026-09-01",
  endDate: "2026-09-30",
  totalOrders: 4,
  revenue: 2317.0,
  foodCost: 900.0,
  staffCost: 129999.0,
  otherExpenses: 81000.0,
  totalExpenses: 211899.0,
  profit: -209582.0,
  profitMargin: -9045.4,
  averageOrderValue: 579.25,
};

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt");

  const { loading, data, error } = useSelector((state) => state.analytics);

  const businessReportData = useSelector((store) => store.analytics.businessReport)

  const [preset, setPreset] = useState("month");
  const [range, setRange] = useState(() => getPresetRange("month"));

  const [openReport, setOpenReport] = useState(false);

  const handleOpenReport = () => setOpenReport(true);
  const handleCloseReport = () => setOpenReport(false);

  const loadData = useCallback(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      fetchDashboardAnalytics(
        restaurantId,
        range.startDate,
        range.endDate,
        jwt,
      ),
    );
  }, [dispatch, restaurantId, range.startDate, range.endDate, jwt]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    dispatch(
      fetchBusinessReport(
        restaurantId,
        range.startDate,
        range.endDate,
        jwt
      )
    )
  },[dispatch, restaurantId, range.startDate, range.endDate, jwt])

  const handlePresetChange = (value) => {
    setPreset(value);
    if (value !== "custom") {
      setRange(getPresetRange(value));
    }
  };

  const handleCustomRangeChange = (startDate, endDate) => {
    setRange({ startDate, endDate });
  };

  const granularity = getGranularity(range.startDate, range.endDate);

  const totalOrdersInRange =
    (data?.monthlyOrders || []).reduce(
      (sum, m) => sum + (m.orderCount || 0),
      0,
    ) || 0;
  const isEmptyPeriod = !loading && !error && totalOrdersInRange === 0;

  const peakDayEntry = (data?.dailyOrders || []).reduce(
    (peak, curr) => (curr.orderCount > (peak?.orderCount ?? -1) ? curr : peak),
    null,
  );
  const showPeakDay =
    !loading && !error && peakDayEntry && peakDayEntry.orderCount > 0;

  
 const handleReportDownload = async () => {
  if (!restaurantId || !jwt) {
    console.error("Missing restaurant ID or JWT authentication token");
    return;
  }

  try {
    const blob = await dispatch(
      downloadBusinessReport(
        restaurantId,
        range.startDate,
        range.endDate,
        jwt
      )
    );

    const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

    const link = document.createElement("a");
    link.href = url;

    const fileName = `business_report_${range.startDate}_to_${range.endDate}.pdf`;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download PDF report:", error);
  }
};

  return (
    <Box className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
          Restaurant Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Monitor restaurant performance, order trends, revenue and
          profitability.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <AnalyticsFilters
          preset={preset}
          startDate={range.startDate}
          endDate={range.endDate}
          onPresetChange={handlePresetChange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: "10px" }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={loadData}
            >
              Retry
            </Button>
          }
        >
          Unable to load analytics.
        </Alert>
      )}

      {isEmptyPeriod && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: "10px" }}>
          No order data available for this period.
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <AnalyticsKpiCards data={data} loading={loading} />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", mb: 2 }}
      >
        <Box>
          {showPeakDay && (
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Peak Day:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#111827" }}
              >
                {formatDateLabel(peakDayEntry.date)} · {peakDayEntry.orderCount}{" "}
                orders
              </Typography>
            </Stack>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AssessmentIcon />}
          onClick={handleOpenReport}
          sx={{
            ml: "auto",
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 0.8,
            whiteSpace: "nowrap",
          }}
        >
          Business Report
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <OrdersOverTimeChart
            data={data}
            granularity={granularity}
            loading={loading}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <RevenueOverTimeChart
            data={data}
            granularity={granularity}
            loading={loading}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <OrdersByHourChart data={data} loading={loading} />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <OrdersByCategoryChart data={data} loading={loading} />
        </Grid>
      </Grid>

      <BusinessReportDialog
        open={openReport}
        onClose={handleCloseReport}
        report={reportData}
        onDownload={handleReportDownload}
        reportData = {businessReportData}
      />
    </Box>
  );
};

export default AnalyticsDashboard;

import React from "react";
import {
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Button,
  Box,
  Paper,
  Chip,
  Skeleton,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const toNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};

const money = (n) =>
  `₹${toNumber(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const percent = (n) => `${toNumber(n).toFixed(1)}%`;

const SectionTitle = ({ children }) => (
  <Typography
    variant="subtitle2"
    sx={{ fontWeight: 700, color: "#0f172a", mb: 1, fontSize: "0.85rem" }}
  >
    {children}
  </Typography>
);

const MetricRow = ({ label, value, isBold = false, color = "#1e293b" }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ py: 0.75 }}
  >
    <Typography
      variant="body2"
      sx={{
        color: isBold ? "#0f172a" : "#64748b",
        fontWeight: isBold ? 600 : 400,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontWeight: isBold ? 700 : 500,
        color,
        fontSize: isBold ? "0.95rem" : "0.875rem",
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const sectionPaper = {
  p: 2,
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#fff",
};

const BusinessReportDialog = ({
  open,
  onClose,
  reportData,
  loading = false,
  error = null,
  downloading = false,
  onDownload,
}) => {
  const {
    startDate = "N/A",
    endDate = "N/A",
    restaurantId = "N/A",
    totalOrders = 0,
    averageOrderValue = 0,
    revenue = 0,
    foodCost = 0,
    staffCost,
    salaryExpense, // fallback in case the backend uses this name
    otherExpenses = 0,
    totalExpenses = 0,
    profit = 0,
    profitMargin = 0,
  } = reportData || {};

  const staff = staffCost ?? salaryExpense ?? 0;
  const hasData = Boolean(reportData) && !loading;
  const isProfitable = toNumber(profit) >= 0;

  const statusColor = isProfitable ? "#16a34a" : "#dc2626";
  const statusBg = isProfitable ? "#f0fdf4" : "#fef2f2";
  const statusBorder = isProfitable ? "#bbf7d0" : "#fecaca";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="business-report-title"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow:
            "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.1)",
              display: "flex",
            }}
          >
            <ReceiptLongIcon sx={{ color: "#38bdf8", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              id="business-report-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              Business report
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.3 }}>
              <StorefrontIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Restaurant #{restaurantId}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close report"
          sx={{ color: "#94a3b8", "&:hover": { color: "#fff" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
        {loading && (
          <Stack spacing={2} sx={{ pt: 3 }}>
            <Skeleton variant="rounded" height={52} />
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={110} />
            <Skeleton variant="rounded" height={190} />
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: "10px" }}>
            Couldn't load the report. Check your connection and try again.
          </Alert>
        )}

        {!loading && !error && !hasData && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: "10px" }}>
            No report data for this period.
          </Alert>
        )}

        {hasData && (
          <Stack spacing={2.5} sx={{ pt: 3 }}>
            <Paper
              elevation={0}
              sx={{
                ...sectionPaper,
                p: 1.5,
                px: 2,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 16, color: "#64748b" }} />
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                  Reporting period
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {startDate} <span style={{ color: "#94a3b8" }}>to</span> {endDate}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: statusBg,
                border: `1px solid ${statusBorder}`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: statusColor }}
                  >
                    {isProfitable ? "Net profit" : "Net loss"}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: statusColor }}>
                    {money(profit)}
                  </Typography>
                </Box>
                <Chip
                  icon={isProfitable ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`Margin ${percent(profitMargin)}`}
                  sx={{
                    fontWeight: 700,
                    color: statusColor,
                    backgroundColor: "#fff",
                    border: `1px solid ${statusBorder}`,
                    "& .MuiChip-icon": { color: statusColor },
                  }}
                />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={sectionPaper}>
              <SectionTitle>Sales and volume</SectionTitle>
              <MetricRow
                label="Total orders"
                value={toNumber(totalOrders).toLocaleString("en-IN")}
              />
              <MetricRow label="Average order value" value={money(averageOrderValue)} />
            </Paper>

            <Paper elevation={0} sx={sectionPaper}>
              <SectionTitle>Financial breakdown</SectionTitle>
              <MetricRow label="Gross revenue" value={money(revenue)} isBold color="#16a34a" />
              <Divider sx={{ my: 1, borderColor: "#f1f5f9" }} />
              <MetricRow label="Food cost" value={money(foodCost)} />
              <MetricRow label="Staff expenses" value={money(staff)} />
              <MetricRow label="Other expenses" value={money(otherExpenses)} />
              <Divider sx={{ my: 1, borderColor: "#f1f5f9" }} />
              <MetricRow label="Total expenses" value={money(totalExpenses)} isBold color="#dc2626" />
            </Paper>
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 2, px: 3, backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", gap: 1 }}
      >
        <Button
          onClick={onClose}
          variant="text"
          sx={{ textTransform: "none", fontWeight: 600, color: "#475569" }}
        >
          Close
        </Button>
        <Button
          onClick={onDownload}
          variant="contained"
          disabled={!hasData || downloading || typeof onDownload !== "function"}
          startIcon={
            downloading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FileDownloadIcon />
            )
          }
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            backgroundColor: "#0f172a",
            "&:hover": { backgroundColor: "#1e293b" },
          }}
        >
          {downloading ? "Downloading…" : "Download PDF"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessReportDialog;
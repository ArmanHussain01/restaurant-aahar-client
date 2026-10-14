import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Button,
  Stack,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; 
import { fetchOrderById } from "../../../customer/state/order/Action";
import { downloadInvoiceReport } from "../../state/analytics/Action";

// import { fetchOrderById, downloadInvoiceReport } from "../../State/Admin/Order/Action";

const money = (n) =>
  `₹${Number(n ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor = (status) => {
  if (status === "COMPLETED" || status === "DELIVERED") return "success";
  if (status === "PENDING") return "warning";
  if (status === "OUT_FOR_DELIVERY") return "info";
  return "default";
};

const statusLabel = (status) =>
  (status || "")
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const InfoRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }} spacing={2}>
    <Typography variant="body2" sx={{ color: "#6b7280" }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500, color: "#111827", textAlign: "right" }}>
      {value}
    </Typography>
  </Stack>
);

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [downloading, setDownloading] = useState(false);

  // Select directly from store.order or store.restaurantOrder
  const { currentOrder, loading, error } = useSelector(
    (store) => store.order || store.restaurantOrder
  );

  const load = () => {
    if (orderId && jwt) {
      dispatch(fetchOrderById(orderId, jwt));
    }
  };

  useEffect(() => {
    load();
  }, [dispatch, orderId, jwt]);

  const handleDownloadInvoice = async () => {
    if (!orderId || !jwt) return;
    setDownloading(true);
    await dispatch(downloadInvoiceReport(orderId, jwt));
    setDownloading(false);
  };

  const current = currentOrder;
  const items = current?.items || [];
  const address = current?.deliveryAddress;
  const addressText = address
    ? [
        address.streetAddress,
        address.city,
        [address.stateProvince, address.postalCode].filter(Boolean).join(" "),
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  const itemsTotal = items.reduce((sum, i) => sum + Number(i.totalPrice ?? 0), 0);
  const grandTotal = current?.totalPrice ?? itemsTotal;

  return (
    <Box className="p-4 sm:p-6 max-w-[1100px] mx-auto">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ textTransform: "none", mb: 2, color: "#475569" }}
      >
        Back to orders
      </Button>

      {error && !loading && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: "10px" }}
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={load}>
              Retry
            </Button>
          }
        >
          {typeof error === "string" ? error : "Couldn't load this order."}
        </Alert>
      )}

      {loading && (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={70} />
          <Skeleton variant="rounded" height={260} />
          <Skeleton variant="rounded" height={160} />
        </Stack>
      )}

      {!loading && current && (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            sx={{ mb: 3 }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
                  Order #{current.id || current._id}
                </Typography>
                <Chip
                  label={statusLabel(current.orderStatus)}
                  color={statusColor(current.orderStatus)}
                  size="small"
                />
              </Stack>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                Placed on {formatDateTime(current.createdAt)}
              </Typography>
            </Box>

            {/* Download Invoice PDF Button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              disabled={downloading}
              onClick={handleDownloadInvoice}
              sx={{ textTransform: "none", borderRadius: "8px", px: 2 }}
            >
              {downloading ? "Downloading..." : "Download Invoice"}
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                <CardContent sx={{ pb: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ReceiptLongOutlinedIcon sx={{ color: "#64748b", fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Items ({current.totalItem ?? items.length})
                    </Typography>
                  </Stack>
                </CardContent>

                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 520 }} aria-label="order items">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          Qty
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                            This order has no items.
                          </TableCell>
                        </TableRow>
                      )}
                      {items.map((item) => {
                        const qty = item.quantity || 1;
                        const unit =
                          Number(item.unitPrice) > 0
                            ? item.unitPrice
                            : Number(item.totalPrice ?? 0) / qty;
                        const food = item.food || {};
                        const ingredients = (item.ingredients || []).filter(Boolean);

                        return (
                          <TableRow key={item.id || item._id} sx={{ verticalAlign: "top" }}>
                            <TableCell>
                              <Stack direction="row" spacing={1.5}>
                                <Avatar
                                  variant="rounded"
                                  src={food.images?.[0]}
                                  alt={food.name || "Food item"}
                                  sx={{ width: 56, height: 56 }}
                                />
                                <Box>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {food.name || "Unnamed item"}
                                    </Typography>
                                    {food.vegetarian !== undefined && (
                                      <Chip
                                        label={food.vegetarian ? "Veg" : "Non-veg"}
                                        size="small"
                                        variant="outlined"
                                        color={food.vegetarian ? "success" : "error"}
                                        sx={{ height: 20, fontSize: "0.7rem" }}
                                      />
                                    )}
                                  </Stack>
                                  {food.foodCategory?.name && (
                                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                      {food.foodCategory.name}
                                    </Typography>
                                  )}
                                  {ingredients.length > 0 && (
                                    <Stack
                                      direction="row"
                                      flexWrap="wrap"
                                      useFlexGap
                                      spacing={0.5}
                                      sx={{ mt: 0.75 }}
                                    >
                                      {ingredients.map((ing) => (
                                        <Chip
                                          key={ing}
                                          label={ing}
                                          size="small"
                                          sx={{ height: 22, fontSize: "0.72rem" }}
                                        />
                                      ))}
                                    </Stack>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{qty}</TableCell>
                            <TableCell align="right">{money(unit)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {money(item.totalPrice)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            <Grid item size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Summary
                    </Typography>
                    <InfoRow label="Items" value={current.totalItem ?? items.length} />
                    <InfoRow label="Subtotal" value={money(itemsTotal)} />
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        Total
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {money(grandTotal)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: "12px" }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <LocationOnOutlinedIcon sx={{ color: "#64748b", fontSize: 20 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Delivery address
                      </Typography>
                    </Stack>
                    {addressText ? (
                      <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.7 }}>
                        {addressText}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        No address provided.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default OrderDetail;
import {
  Box,
  Card,
  CardHeader,
  Chip,
  AvatarGroup,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantOrders,
  updateOrderStatus,
} from "../../state/restaurantOrders/Action";
import { useNavigate } from "react-router-dom";

const orderStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const OrderTable = ({ filterValue = "ALL" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const [anchorElMap, setAnchorElMap] = useState({});

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );
  const { orders = [] } = useSelector((store) => store.restaurantOrder);
  const restaurantId = usersRestaurant?.id;

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantOrders({ restaurantId, jwt }));
    }
  }, [dispatch, restaurantId, jwt]);

  const handleMenuOpen = (event, orderId) => {
    setAnchorElMap((prev) => ({ ...prev, [orderId]: event.currentTarget }));
  };

  const handleMenuClose = (orderId) => {
    setAnchorElMap((prev) => ({ ...prev, [orderId]: null }));
  };

  const handleUpdateStatus = (orderId, orderStatus) => {
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
    handleMenuClose(orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterValue === "ALL") return true;
    return order.orderStatus === filterValue;
  });

  return (
    <Box className="p-2">
      <Card className="mt-1 shadow-sm">
        <CardHeader
          title="All Orders"
          sx={{ pt: 2, pb: 2, alignItems: "center" }}
        />
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                <TableCell className="font-semibold">ID</TableCell>
                <TableCell align="center" className="font-semibold">
                  Items
                </TableCell>
                <TableCell align="left" className="font-semibold">
                  Customer
                </TableCell>
                <TableCell align="center" className="font-semibold">
                  Price
                </TableCell>
                <TableCell align="left" className="font-semibold">
                  Name
                </TableCell>
                <TableCell align="left" className="font-semibold">
                  Ingredients
                </TableCell>
                <TableCell align="center" className="font-semibold">
                  Status
                </TableCell>
                <TableCell align="center" className="font-semibold">
                  Update Status
                </TableCell>
                <TableCell align="center" className="font-semibold">
                  Details
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No orders found with status "{filterValue}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const items = order.items || [];
                  const foodNames = items
                    .map((item) => item.food?.name)
                    .filter(Boolean)
                    .join(", ");
                  const foodImages = items
                    .map((item) => item.food?.images?.[0])
                    .filter(Boolean);
                  const ingredientsList = items
                    .flatMap((item) => item.ingredients || [])
                    .filter((ing) => ing && ing !== "")
                    .join(", ");

                  const anchorEl = anchorElMap[order.id];
                  const isOpen = Boolean(anchorEl);

                  return (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="font-medium"
                      >
                        #{order.id}
                      </TableCell>

                      <TableCell align="center">
                        <div className="flex justify-center">
                          <AvatarGroup max={3}>
                            {foodImages.map((imgUrl, i) => (
                              <Avatar key={i} src={imgUrl} alt="Food item" />
                            ))}
                          </AvatarGroup>
                        </div>
                      </TableCell>

                      <TableCell align="left">
                        {order.customerEmail ||
                          order.deliveryAddress?.email ||
                          "N/A"}
                      </TableCell>

                      <TableCell align="center" className="font-semibold">
                        ₹{order.totalPrice}
                      </TableCell>

                      <TableCell align="left">{foodNames || "N/A"}</TableCell>

                      <TableCell align="left">
                        {ingredientsList || "None"}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={order.orderStatus}
                          color={
                            order.orderStatus === "COMPLETED" ||
                            order.orderStatus === "DELIVERED"
                              ? "success"
                              : order.orderStatus === "PENDING"
                                ? "warning"
                                : "default"
                          }
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          id={`button-${order.id}`}
                          aria-controls={
                            isOpen ? `menu-${order.id}` : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={isOpen ? "true" : undefined}
                          onClick={(e) => handleMenuOpen(e, order.id)}
                          variant="outlined"
                          size="small"
                        >
                          Update
                        </Button>

                        <Menu
                          id={`menu-${order.id}`}
                          anchorEl={anchorEl}
                          open={isOpen}
                          onClose={() => handleMenuClose(order.id)}
                          MenuListProps={{
                            "aria-labelledby": `button-${order.id}`,
                          }}
                        >
                          {orderStatusOptions.map((status) => (
                            <MenuItem
                              key={status.value}
                              onClick={() =>
                                handleUpdateStatus(order.id, status.value)
                              }
                              selected={order.orderStatus === status.value}
                            >
                              {status.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            navigate(`/owner/restaurants/orders/${order.id}`)
                          }
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#0f172a",
                            "&:hover": { backgroundColor: "#1e293b" },
                          }}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default OrderTable;

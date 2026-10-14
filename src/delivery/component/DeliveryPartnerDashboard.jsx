import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Avatar, Box, Chip, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import DeliveryDiningOutlined from "@mui/icons-material/DeliveryDiningOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { logOut } from "../../auth/state/authentication/Action";
import { fetchMyDeliveries, resetDeliveryState } from "../state/delivery/Action";
import { selectActive } from "../state/delivery/selectors";
import { selectAuthUser, selectIsAuthenticated } from "../../shared/util/authSelectors";
import { selectJwt } from "../../shared/util/authToken";
import useLocationTracking from "../hooks/useLocationTracking";
import LocationStatusBanner from "./LocationStatusBanner";
import { DELIVERY_STATUS } from "../../shared/util/deliveryStatus";

const WIDTH = 240;
const POLL_MS = 30000;
const NAV = [
  { label: "Overview", to: "/delivery", icon: <DashboardOutlined />, end: true },
  { label: "Assigned", to: "/delivery/assigned", icon: <AssignmentOutlined /> },
  { label: "Active", to: "/delivery/active", icon: <DeliveryDiningOutlined /> },
  { label: "History", to: "/delivery/history", icon: <HistoryOutlined /> },
];

export default function DeliveryPartnerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector(selectAuthUser);
  const authed = useSelector(selectIsAuthenticated);
  const jwt = useSelector(selectJwt);
  const active = useSelector(selectActive);

  useEffect(() => {
    dispatch(fetchMyDeliveries(jwt));
    const tick = () => document.visibilityState === "visible" && dispatch(fetchMyDeliveries(jwt, { silent: true }));
    const id = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      dispatch(resetDeliveryState());
    };
  }, [dispatch, jwt]);

  const outForDelivery = active.find((d) => d.status === DELIVERY_STATUS.OUT_FOR_DELIVERY);
  const tracking = useLocationTracking({
    delivery: outForDelivery,
    jwt,
    enabled: authed,
    onStale: () => dispatch(fetchMyDeliveries(jwt, { silent: true })),
  });

  const name = user?.fullName ?? user?.name ?? user?.email ?? "Delivery partner";
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  const isSelected = (n) => (n.end ? pathname === n.to : pathname.startsWith(n.to));
  const drawer = (
    <Box role="navigation" aria-label="Delivery navigation">
      <Toolbar><Typography variant="h6" fontWeight={700}>Deliveries</Typography></Toolbar>
      <List>
        {NAV.map((n) => (
          <ListItemButton key={n.to} component={RouterLink} to={n.to} selected={isSelected(n)} onClick={() => setMobileOpen(false)} sx={{ mx: 1, borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{n.icon}</ListItemIcon>
            <ListItemText primary={n.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", ml: { md: `${WIDTH}px` }, width: { md: `calc(100% - ${WIDTH}px)` } }}>
        <Toolbar>
          {!isDesktop && <IconButton edge="start" aria-label="Open navigation" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}><MenuIcon /></IconButton>}
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip size="small" variant="outlined" color={active.length ? "warning" : "success"} label={active.length ? "On delivery" : "No active delivery"} />
            {isDesktop && <Typography variant="body2">{name}</Typography>}
            <Avatar sx={{ width: 32, height: 32 }} alt={name}>{name.charAt(0).toUpperCase()}</Avatar>
            <IconButton aria-label="Log out" onClick={handleLogout}><LogoutOutlined /></IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant={isDesktop ? "permanent" : "temporary"} open={isDesktop || mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: WIDTH, boxSizing: "border-box" } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, minWidth: 0 }}>
        <Toolbar />
        <LocationStatusBanner tracking={tracking} />
        <Outlet />
      </Box>
    </Box>
  );
}

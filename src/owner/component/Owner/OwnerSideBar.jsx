import React from "react";
import { Dashboard } from "@mui/icons-material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../../auth/state/authentication/Action";

const menu = [
  { title: "Dashboard", icon: <Dashboard />, pth: "/" },
  { title: "Orders", icon: <ShoppingBagIcon />, pth: "/orders" },
  { title: "Menu", icon: <ShopTwoIcon />, pth: "/menu" },
  { title: "Food Category", icon: <FastfoodIcon />, pth: "/category" },
  { title: "Ingredients", icon: <CategoryIcon />, pth: "/ingredients" },
  { title: "Events", icon: <EventIcon />, pth: "/events" },
  { title: "Staff", icon: <PeopleIcon />, pth: "/staff" },
  { title: "Expense", icon: <CurrencyRupeeIcon />, pth: "/expenses" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, pth: "/details" },
  { title: "Log Out", icon: <LogoutIcon />, pth: "/logout" },
];

const OwnerSideBar = ({ handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleNavigate = (item) => {
    if (item.title === "Log Out") {
      dispatch(logOut());
      navigate("/");
      if (handleClose) handleClose();
      return;
    }

    // Access item.pth instead of item.path
    navigate(`/owner/restaurants${item.pth}`);
    if (isSmallScreen && handleClose) {
      handleClose();
    }
  };

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      onClose={handleClose}
      open={true}
      anchor="left"
      PaperProps={{
        className: "border-r border-gray-800 bg-[#0d0d0d] text-white",
      }}
      sx={{ zIndex: 1201 }}
    >
      <div className="w-[70vw] sm:w-[50vw] lg:w-[18vw] h-full flex flex-col justify-between py-6">
        <div>
          <div className="px-6 pb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-600/30">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">
                Admin Hub
              </h1>
              <p className="text-xs text-gray-400">Management Console</p>
            </div>
          </div>
          <Divider className="!border-gray-800 mb-4" />

          <nav className="px-3 space-y-1">
            {menu.map((item) => {
              const isLogout = item.title === "Log Out";
              if (isLogout) return null;

              const fullPath = `/admin/restaurants${item.pth}`;
              const isActive = location.pathname === fullPath;

              return (
                <div key={item.title}>
                  <button
                    onClick={() => handleNavigate(item)}
                    className={`w-full px-4 py-3 rounded-xl flex items-center gap-4 text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/20"
                        : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                    }`}
                  >
                    <span
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-orange-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pt-4">
          <Divider className="!border-gray-800 mb-4" />
          <button
            onClick={() => handleNavigate({ title: "Log Out", pth: "/logout" })}
            className="w-full px-4 py-3 rounded-xl flex items-center gap-4 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              <LogoutIcon />
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default OwnerSideBar;

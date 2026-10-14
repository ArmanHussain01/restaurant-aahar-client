import React from "react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HouseIcon from "@mui/icons-material/House";
import PaymentIcon from "@mui/icons-material/Payment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../../auth/state/authentication/Action";

const menu = [
  { title: "Orders", icon: <ShoppingBasketIcon /> },
  { title: "Favorites", icon: <FavoriteIcon /> },
  { title: "Address", icon: <HouseIcon /> },
  { title: "Payments", icon: <PaymentIcon /> },
  { title: "Notification", icon: <NotificationsIcon /> },
  { title: "Events", icon: <EventIcon /> },
  { title: "Logout", icon: <LogoutIcon /> },
];

const ProfileNavigation = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:1024px)");

  const dispatch = useDispatch();

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logOut());
      navigate("/");
    } else navigate(`/my-profile/${item.title.toLowerCase()}`);
  };

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      onClose={handleClose}
      open={isSmallScreen ? open : true}
      anchor="left"
      PaperProps={{
        sx: {
          top: { lg: "65px", xs: "0px" },
          height: { lg: "calc(100vh - 65px)", xs: "100vh" },
          position: isSmallScreen ? "fixed" : "sticky",
          backgroundColor: "#0d0d0d",
          color: "white",
          borderRight: "1px solid #262626",
          zIndex: isSmallScreen ? 1300 : 1,
        },
      }}
    >
      <div className="w-[70vw] sm:w-[50vw] lg:w-[20vw] h-full flex flex-col justify-center text-lg gap-6 py-6">
        {menu.map((item, i) => (
          <React.Fragment key={i}>
            <div
              onClick={() => handleNavigate(item)}
              className="px-6 flex items-center space-x-5 cursor-pointer hover:text-[#e91e63] transition duration-200"
            >
              {item.icon}
              <span className="font-medium text-base sm:text-lg">
                {item.title}
              </span>
            </div>
            {i !== menu.length - 1 && (
              <Divider sx={{ borderColor: "#ecbfa9" }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </Drawer>
  );
};

export default ProfileNavigation;

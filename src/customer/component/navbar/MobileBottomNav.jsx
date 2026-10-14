import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HouseIcon from "@mui/icons-material/House";
import EventIcon from "@mui/icons-material/Event";

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { title: "Orders", path: "/my-profile/orders", icon: <ShoppingBasketIcon /> },
    { title: "Favorites", path: "/my-profile/favorites", icon: <FavoriteIcon /> },
    { title: "Address", path: "/my-profile/address", icon: <HouseIcon /> },
    { title: "Events", path: "/my-profile/events", icon: <EventIcon /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t border-[#E08A5E]/20 flex justify-around items-center py-2 lg:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs transition-colors duration-200 ${
              isActive ? "text-[#C85A32] font-semibold" : "text-[#5C5650]"
            }`}
          >
            <div className={isActive ? "text-[#C85A32]" : "text-[#5C5650]"}>
              {item.icon}
            </div>
            <span>{item.title}</span>
          </button>
        );
      })}
    </div>
  );
};
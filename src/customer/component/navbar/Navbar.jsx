import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Badge, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavbarSearchOverlay } from "./NavbarSearchOverlay";

export const Navbar = () => {
  const user = useSelector((store) => store.auth?.user);

  const cart = useSelector((store) => store.cart?.cart);

  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);

  const handleAvatarClick = () => {
    if (user?.role === "ROLE_CUSTOMER") {
      navigate("/my-profile");
    } else {
      navigate("/admin/restaurant");
    }
  };

  const getCartCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <div className="sticky top-0 z-50 px-5 py-[0.8rem] bg-[#C85A32] lg:px-20 flex justify-between items-center shadow-md">
      <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
        <span
          onClick={() => navigate("/")}
          className="logo font-semibold text-[#F9F6F0] text-2xl tracking-wide"
        >
          Restaurant Mana
        </span>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-10 text-[#F9F6F0]">
        <div>
          <IconButton
            aria-label="Search food"
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
            sx={{ color: "#F9F6F0" }}
          >
            <SearchIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </div>

        <div>
          {user ? (
            <Avatar
              onClick={handleAvatarClick}
              sx={{
                bgcolor: "#F9F6F0",
                color: "#C85A32",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {user.fullName?.[0]?.toUpperCase() || "U"}
            </Avatar>
          ) : (
            <IconButton
              aria-label="Log in"
              onClick={() => navigate("/account/login")}
            >
              <PersonIcon sx={{ color: "#F9F6F0" }} />
            </IconButton>
          )}
        </div>

        <div>
          <IconButton
            aria-label="Cart"
            onClick={() => navigate("/cart")}
            sx={{ color: "#F9F6F0" }}
          >
            <Badge
              badgeContent={getCartCount()}
              showZero
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#E08A5E",
                  color: "#FFFFFF",
                },
              }}
            >
              <AddShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
            </Badge>
          </IconButton>
        </div>
      </div>

      <NavbarSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

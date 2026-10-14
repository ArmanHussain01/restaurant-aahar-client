import { Card, Chip, IconButton } from "@mui/material";
import React, { memo, useCallback } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isPresentInFavorites } from "../../../shared/config/logic";
import { addToFavorites } from "../../../auth/state/authentication/Action";


const FALLBACK_IMG = "/placeholder.png";

const RestaurantCart = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFavorite = useSelector((store) =>
    isPresentInFavorites(store.auth?.favorites, item),
  );

  const isOpen = Boolean(item.open);
  const image = item.images?.[1] || item.images?.[0] || FALLBACK_IMG;

  const goToRestaurant = useCallback(() => {
    if (!isOpen) return;
    navigate(`/restaurant/${item.address?.city}/${item.name}/${item.id}`);
  }, [isOpen, navigate, item.address?.city, item.name, item.id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToRestaurant();
    }
  };

  const handleFavorite = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(addToFavorites(localStorage.getItem("jwt"), item.id));
    },
    [dispatch, item.id],
  );

  return (
    <Card
      onClick={goToRestaurant}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={isOpen ? 0 : -1}
      aria-disabled={!isOpen}
      aria-label={`${item.name}, ${isOpen ? "open" : "closed"}`}
      className={`group relative w-full overflow-hidden transition-shadow duration-200 ${
        isOpen
          ? "cursor-pointer hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600"
          : "cursor-not-allowed"
      }`}
      sx={{ borderRadius: 3 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-800">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          width={400}
          height={250}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            isOpen ? "group-hover:scale-105" : "grayscale opacity-60"
          }`}
        />
        <Chip
          size="small"
          color={isOpen ? "success" : "error"}
          label={isOpen ? "Open" : "Closed"}
          sx={{ position: "absolute", top: 10, left: 10, fontWeight: 600 }}
        />
      </div>

      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-lg font-semibold">{item.name}</p>
          <p className="line-clamp-2 text-sm text-gray-500">
            {item.description}
          </p>
        </div>

        <IconButton
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          size="small"
          sx={{ color: isFavorite ? "#e11d48" : "inherit" }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </div>
    </Card>
  );
};


export default memo(RestaurantCart);
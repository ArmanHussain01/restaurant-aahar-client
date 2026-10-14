import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { brand, focusRing } from "../../../shared/theme/searchTheme";


const VegMark = ({ vegetarian }) => {
  const color = vegetarian ? "#2E7D32" : "#C62828";
  return (
    <Box
      role="img"
      aria-label={vegetarian ? "Vegetarian" : "Non-vegetarian"}
      sx={{
        width: 16,
        height: 16,
        flexShrink: 0,
        border: `1.5px solid ${color}`,
        borderRadius: "3px",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
    </Box>
  );
};

export const FoodResultCard = ({ food, onAddToCart }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const unavailable = food.available === false;
  const image = food.images?.[0];
  const restaurantName = food.restaurantName ?? food.restaurant?.name;

  return (
    <Paper
      component="article"
      elevation={0}
      aria-label={food.name}
      sx={{
        display: "flex",
        gap: 2,
        p: 1.5,
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${brand.border}`,
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(43, 38, 35, 0.06)",
        transition: "box-shadow 150ms ease, border-color 150ms ease",
        "&:hover": unavailable
          ? undefined
          : { boxShadow: "0 4px 14px rgba(43, 38, 35, 0.1)", borderColor: brand.accent },
        "&:focus-within": { borderColor: brand.primary },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: 96, sm: 112 },
          height: { xs: 96, sm: 112 },
          flexShrink: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: brand.cream,
          display: "grid",
          placeItems: "center",
          filter: unavailable ? "grayscale(1)" : "none",
          opacity: unavailable ? 0.6 : 1,
        }}
      >
        {image && !imageFailed ? (
          <Box
            component="img"
            src={image}
            alt={food.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <RestaurantIcon aria-hidden sx={{ color: brand.accent, fontSize: 36 }} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <VegMark vegetarian={!!food.vegetarian} />
          <Typography
            component="h3"
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: unavailable ? brand.muted : brand.text,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {food.name}
          </Typography>
        </Box>

        {restaurantName && (
          <Typography
            variant="caption"
            sx={{ color: brand.muted, display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}
          >
            <StorefrontIcon sx={{ fontSize: 14 }} aria-hidden />
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {restaurantName}
            </Box>
          </Typography>
        )}

        {food.description && (
          <Typography
            variant="body2"
            sx={{
              color: brand.muted,
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {food.description}
          </Typography>
        )}

        {(food.seasonal || unavailable) && (
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 0.75 }}>
            {food.seasonal && (
              <Chip
                size="small"
                label="Seasonal"
                sx={{ bgcolor: brand.tint, color: brand.primaryDark, fontWeight: 600 }}
              />
            )}
            {unavailable && (
              <Chip size="small" label="Unavailable" sx={{ bgcolor: "#EEE", color: "#555", fontWeight: 600 }} />
            )}
          </Box>
        )}

        <Box
          sx={{
            mt: "auto",
            pt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: unavailable ? brand.muted : brand.text }}
          >
            ₹{food.price}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            disabled={unavailable}
            onClick={() => onAddToCart(food)}
            startIcon={<AddShoppingCartIcon />}
            aria-label={unavailable ? `${food.name} is unavailable` : `Add ${food.name} to cart`}
            sx={{
              minHeight: 40,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: brand.primary,
              transition: "background-color 150ms ease",
              "&:hover": { bgcolor: brand.primaryDark },
              "&.Mui-focusVisible": focusRing,
            }}
          >
            {unavailable ? "Unavailable" : "Add to cart"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

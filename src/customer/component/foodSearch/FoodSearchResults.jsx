import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { FoodResultCard } from "./FoodResultCard";
import { FoodSearchSkeleton } from "./FoodSearchSkeleton";

import { PopularSearches } from "./PopularSearches";
import { brand } from "../../../shared/theme/searchTheme";

const Message = ({ icon, title, text, children }) => (
  <Box
    role="status"
    sx={{
      textAlign: "center",
      py: { xs: 6, md: 8 },
      px: 2,
      border: `1px dashed ${brand.border}`,
      borderRadius: 3,
      bgcolor: "#fff",
    }}
  >
    <Box sx={{ color: brand.accent, mb: 1, "& svg": { fontSize: 48 } }}>
      {icon}
    </Box>
    <Typography
      variant="h6"
      component="h2"
      sx={{ fontWeight: 700, color: brand.text }}
    >
      {title}
    </Typography>
    {text && (
      <Typography variant="body2" sx={{ color: brand.muted, mt: 0.5, mb: 2 }}>
        {text}
      </Typography>
    )}
    {children}
  </Box>
);

export const FoodSearchResults = ({
  loading,
  error,
  foods,
  rawCount,
  keyword,
  popularSearches,
  onRetry,
  onSelectPopular,
  onAddToCart,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) return <FoodSearchSkeleton count={isMobile ? 6 : 8} />;

  if (error) {
    return (
      <Message
        icon={<ErrorOutlineOutlinedIcon />}
        title="Unable to load search results."
      >
        <Button
          variant="contained"
          disableElevation
          onClick={onRetry}
          sx={{
            mt: 2,
            minHeight: 44,
            px: 4,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: brand.primary,
            "&:hover": { bgcolor: brand.primaryDark },
          }}
        >
          Retry
        </Button>
      </Message>
    );
  }

  if (!keyword) {
    return (
      <Message
        icon={<ManageSearchIcon />}
        title="What are you craving?"
        text="Type a dish above or pick a popular search."
      >
        <Box sx={{ maxWidth: 520, mx: "auto", textAlign: "left" }}>
          <PopularSearches
            items={popularSearches}
            onSelect={onSelectPopular}
            showLabel={false}
            alwaysWrap
          />
        </Box>
      </Message>
    );
  }

  // Results exist on this page, but the active filters hide all of them.
  if (foods.length === 0 && rawCount > 0) {
    return (
      <Message
        icon={<SearchOffIcon />}
        title="No food matches these filters"
        text="Clear the filters to see all results on this page."
      >
        <Button
          onClick={onClearFilters}
          sx={{ textTransform: "none", fontWeight: 700, color: brand.primary }}
        >
          Clear filters
        </Button>
      </Message>
    );
  }

  if (foods.length === 0) {
    return (
      <Message
        icon={<SearchOffIcon />}
        title="No food found"
        text="Try another search or browse popular searches."
      >
        <Box sx={{ maxWidth: 520, mx: "auto", textAlign: "left" }}>
          <PopularSearches
            items={popularSearches}
            onSelect={onSelectPopular}
            showLabel={false}
            alwaysWrap
          />
        </Box>
      </Message>
    );
  }

  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {foods.map((food) => (
        <Box component="li" key={food.id} sx={{ minWidth: 0 }}>
          <FoodResultCard food={food} onAddToCart={onAddToCart} />
        </Box>
      ))}
    </Box>
  );
};

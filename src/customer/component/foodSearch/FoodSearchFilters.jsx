import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { brand } from "../../../shared/theme/searchTheme";

const FOOD_TYPES = [
  { value: "all", label: "All" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "seasonal", label: "Seasonal" },
  { value: "available", label: "Available now" },
];

// Helper to reliably compute selected radio value from URL filter parameters
const getSelectedValue = (filters = {}) => {
  if (filters.vegetarian === true || filters.vegetarian === "true") return "vegetarian";
  if (filters.seasonal === true || filters.seasonal === "true") return "seasonal";
  if (filters.available === true || filters.available === "true") return "available";
  return "all";
};

const FilterRadioGroup = ({ filters, onChange }) => {
  const currentValue = getSelectedValue(filters);

  return (
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        aria-label="food-type"
        name="food_type"
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {FOOD_TYPES.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            label={item.label}
            sx={{ minHeight: 44, mx: 0 }}
            control={
              <Radio
                sx={{
                  color: brand.border,
                  "&.Mui-checked": { color: brand.primary },
                }}
              />
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const FoodSearchFilters = ({
  filters,
  onChange,
  onClear,
  activeCount,
  mobileOpen,
  onMobileClose,
}) => (
  <>
    {/* Desktop Filter Panel */}
    <Paper
      component="aside"
      aria-label="Filters"
      elevation={0}
      sx={{
        display: { xs: "none", lg: "block" },
        position: "sticky",
        top: 88,
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${brand.border}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Food Type
        </Typography>
        {activeCount > 0 && (
          <Button
            size="small"
            onClick={onClear}
            sx={{ textTransform: "none", color: brand.primary }}
          >
            Clear
          </Button>
        )}
      </Box>

      <FilterRadioGroup filters={filters} onChange={onChange} />
    </Paper>

    {/* Mobile Bottom Drawer */}
    <Drawer
      anchor="bottom"
      open={mobileOpen}
      onClose={onMobileClose}
      sx={{ display: { lg: "none" } }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "80vh",
          px: 2,
          pt: 1.5,
          pb: "calc(16px + env(safe-area-inset-bottom, 0px))",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 4,
          borderRadius: 2,
          bgcolor: brand.border,
          mx: "auto",
          mb: 1.5,
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Food Type
        </Typography>
        <IconButton
          aria-label="Close filters"
          onClick={onMobileClose}
          sx={{ width: 44, height: 44 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <FilterRadioGroup filters={filters} onChange={onChange} />

      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClear}
          disabled={activeCount === 0}
          sx={{
            minHeight: 48,
            textTransform: "none",
            fontWeight: 700,
            color: brand.primary,
            borderColor: brand.primary,
          }}
        >
          Clear all
        </Button>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={onMobileClose}
          sx={{
            minHeight: 48,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: brand.primary,
            "&:hover": { bgcolor: brand.primaryDark },
          }}
        >
          Show results
        </Button>
      </Box>
    </Drawer>
  </>
);
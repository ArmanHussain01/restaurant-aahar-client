import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { brand, focusRing } from "../../../shared/theme/searchTheme";

export const FoodSearchBar = ({
  value,
  onChange,
  onSubmit,
  onClear,
  inputRef,
  autoFocus = false,
  clearOnEscape = false,
  id = "food-search-input",
}) => {
  const handleKeyDown = (e) => {
    // On the search page Escape clears the text; in the overlay it falls
    // through so the dialog closes.
    if (e.key === "Escape" && clearOnEscape && value) {
      e.stopPropagation();
      onClear?.();
    }
  };

  return (
    <Box
      component="form"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      sx={{ width: "100%" }}
    >
      <TextField
        id={id}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search food..."
        autoFocus={autoFocus}
        inputRef={inputRef}
        inputProps={{
          "aria-label": "Search food",
          autoComplete: "off",
          enterKeyHint: "search",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: brand.primary }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                onClick={onClear}
                edge="end"
                sx={{ width: 40, height: 40 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            minHeight: 52,
            borderRadius: 3,
            backgroundColor: "#fff",
            transition: "box-shadow 150ms ease, border-color 150ms ease",
            "& fieldset": { borderColor: brand.border },
            "&:hover fieldset": { borderColor: brand.accent },
            "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(200, 90, 50, 0.18)" },
            "&.Mui-focused fieldset": { borderColor: brand.primary, borderWidth: 2 },
          },
        }}
      />
    </Box>
  );
};

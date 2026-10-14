import { Box, Chip, Typography } from "@mui/material";
import { brand, focusRing } from "../../../shared/theme/searchTheme";

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const PopularSearches = ({
  items = [],
  onSelect,
  activeKeyword = "",
  showLabel = true,
  alwaysWrap = false,
}) => {
  if (!items.length) return null;

  return (
    <Box>
      {showLabel && (
        <Typography
          id="popular-searches-label"
          variant="body2"
          sx={{ color: brand.muted, fontWeight: 600, mb: 1 }}
        >
          Popular searches
        </Typography>
      )}
      <Box
        role="group"
        aria-labelledby={showLabel ? "popular-searches-label" : undefined}
        aria-label={showLabel ? undefined : "Popular searches"}
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: alwaysWrap ? "wrap" : { xs: "nowrap", sm: "wrap" },
          overflowX: alwaysWrap ? "visible" : { xs: "auto", sm: "visible" },
          // Bleed to the screen edge on mobile so the scroll feels natural.
          mx: alwaysWrap ? 0 : { xs: -2, sm: 0 },
          px: alwaysWrap ? 0 : { xs: 2, sm: 0 },
          pb: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((term) => {
          const active = term.toLowerCase() === activeKeyword.trim().toLowerCase();
          return (
            <Chip
              key={term}
              label={capitalize(term)}
              clickable
              onClick={() => onSelect(term)}
              aria-pressed={active}
              sx={{
                flexShrink: 0,
                height: 38,
                borderRadius: 999,
                fontWeight: 600,
                px: 0.5,
                backgroundColor: active ? brand.primary : "#fff",
                color: active ? "#fff" : brand.primary,
                border: `1px solid ${active ? brand.primary : brand.border}`,
                transition: "background-color 150ms ease, border-color 150ms ease",
                "&:hover": {
                  backgroundColor: active ? brand.primaryDark : brand.tint,
                  borderColor: brand.primary,
                },
                "&.Mui-focusVisible": { ...focusRing, backgroundColor: brand.tint },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

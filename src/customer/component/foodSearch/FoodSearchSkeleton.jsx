import { Box, Paper, Skeleton } from "@mui/material";
import React from "react";
import { brand, focusRing } from "../../../shared/theme/searchTheme";

const SkeletonCard = () => (
  <Paper
    elevation={0}
    sx={{
      display: "flex",
      gap: 2,
      p: 1.5,
      borderRadius: 3,
      border: `1px solid ${brand.border}`,
    }}
  >
    <Skeleton
      variant="rounded"
      width={112}
      height={112}
      sx={{ flexShrink: 0, borderRadius: 2 }}
    />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Skeleton variant="text" width="60%" height={26} />
      <Skeleton variant="text" width="95%" />
      <Skeleton variant="text" width="75%" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Skeleton variant="text" width={56} height={28} />
        <Skeleton variant="rounded" width={104} height={36} />
      </Box>
    </Box>
  </Paper>
);

export const FoodSearchSkeleton = ({ count = 8 }) => (
  <Box
    aria-busy="true"
    aria-label="Loading search results"
    sx={{
      display: "grid",
      gap: 2,
      gridTemplateColumns: {
        xs: "minmax(0, 1fr)",
        sm: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(3, minmax(0, 1fr))",
      },
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Box>
);

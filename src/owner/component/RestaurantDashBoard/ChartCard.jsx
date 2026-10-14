import React from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";

const ChartCard = ({
  title,
  description,
  loading,
  isEmpty,
  emptyMessage,
  height = 280,
  children,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "12px",
        borderColor: "#e5e7eb",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#111827" }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#9ca3af", mb: 2 }}
        >
          {description}
        </Typography>

        {loading ? (
          <Skeleton
            variant="rounded"
            width="100%"
            height={height}
          />
        ) : isEmpty ? (
          <Box
            sx={{
              width: "100%",
              height: `${height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: 14,
              border: "1px dashed #e5e7eb",
              borderRadius: "8px",
            }}
          >
            {emptyMessage || "No order data available for this period."}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: `${height}px`,
              position: "relative",
            }}
          >
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default ChartCard;

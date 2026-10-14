

import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, TextField, Stack } from "@mui/material";

const PRESETS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];


const AnalyticsFilters = ({ preset, startDate, endDate, onPresetChange, onCustomRangeChange }) => {
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  const handlePreset = (_event, value) => {
    if (!value) return;
    onPresetChange(value);
    if (value === "custom") {
      setCustomStart(startDate);
      setCustomEnd(endDate);
    }
  };

  const handleApplyCustom = () => {
    if (customStart && customEnd) {
      onCustomRangeChange(customStart, customEnd);
    }
  };

  return (
    <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <ToggleButtonGroup
        value={preset}
        exclusive
        onChange={handlePreset}
        size="small"
        aria-label="date range preset"
        sx={{
          flexWrap: "wrap",
          "& .MuiToggleButton-root": {
            textTransform: "none",
            px: 2,
            borderRadius: "8px !important",
            border: "1px solid #e2e5ea",
            mr: 1,
            mb: 1,
          },
        }}
      >
        {PRESETS.map((p) => (
          <ToggleButton key={p.value} value={p.value} aria-label={p.label}>
            {p.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {preset === "custom" && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
          <TextField
            label="Start date"
            type="date"
            size="small"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End date"
            type="date"
            size="small"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <ToggleButton
            value="apply"
            selected={false}
            onClick={handleApplyCustom}
            sx={{
              textTransform: "none",
              borderRadius: "8px !important",
              px: 2,
              border: "1px solid #e2e5ea",
              bgcolor: "#111827",
              color: "#fff",
              "&:hover": { bgcolor: "#1f2937" },
            }}
          >
            Apply
          </ToggleButton>
        </Stack>
      )}
    </Box>
  );
};

export default AnalyticsFilters;

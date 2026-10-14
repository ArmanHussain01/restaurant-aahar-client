import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { brand } from "../../../shared/theme/searchTheme";

import { PopularSearches } from "../foodSearch/PopularSearches";
import { FoodSearchBar } from "../foodSearch/FoodSearchBar";
import { fetchPopularSearches } from "../../state/search/action";

export const NavbarSearchOverlay = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popularSearches =
    useSelector((store) => store.foodSearch?.popularSearches) || [];

  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    // console.log("useEffect triggered, open status:", open);
    if (open) dispatch(fetchPopularSearches(jwt));
  }, [dispatch, jwt, open]);

  const goToSearch = (term) => {
    const keyword = term.trim();
    if (!keyword) return;
    onClose();
    navigate(
      `/search?${new URLSearchParams({ name: keyword, page: "0", size: "10" })}`,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      aria-labelledby="navbar-search-title"
      TransitionProps={{
        onEntered: () => inputRef.current?.focus(),
        onExited: () => setValue(""),
      }}
      sx={{
        "& .MuiDialog-container": { alignItems: { sm: "flex-start" } },
      }}
      PaperProps={{
        sx: {
          bgcolor: brand.cream,
          m: { xs: 0, sm: 0 },
          mt: { sm: 10 },
          borderRadius: { xs: 0, sm: 4 },
          maxWidth: { sm: 720 },
          width: "100%",
          boxShadow: "0 12px 40px rgba(43, 38, 35, 0.25)",
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: "calc(16px + env(safe-area-inset-bottom, 0px))", sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography
            id="navbar-search-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700, color: brand.text }}
          >
            Search food
          </Typography>
          <IconButton
            aria-label="Close search"
            onClick={onClose}
            sx={{ width: 44, height: 44 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <FoodSearchBar
          id="navbar-search-input"
          value={value}
          onChange={setValue}
          onSubmit={goToSearch}
          onClear={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          inputRef={inputRef}
          autoFocus
        />

        <Box sx={{ mt: 2.5 }}>
          <PopularSearches items={popularSearches} onSelect={goToSearch} />
        </Box>
      </Box>
    </Dialog>
  );
};

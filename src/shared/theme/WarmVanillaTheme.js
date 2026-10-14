import { createTheme } from "@mui/material";

export const WarmVanillaTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#C85A32", // Terracotta
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E08A5E", // Burnt Amber
    },
    background: {
      default: "#F9F6F0", // Soft Cream
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2B2825", // Charcoal Black
      secondary: "#5C5650",
    },
  },
});
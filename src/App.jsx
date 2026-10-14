import { ThemeProvider } from "@emotion/react";
import "./App.css";
import { darkTheme } from "./shared/theme/DarkTheme";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./auth/state/authentication/Action";
import { findCart } from "./customer/state/cart/Action";
import { WarmVanillaTheme } from "./shared/theme/WarmVanillaTheme";
import Routers from "./Routers/Routers";
import { getRestaurantByUserId } from "./customer/state/restaurant/Action";
function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const jwt = auth.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(findCart(jwt));
    }
  }, [auth.jwt, dispatch]);

  useEffect(() => {
    if (jwt) {
      dispatch(getRestaurantByUserId(jwt));
    }
  }, [auth.jwt, dispatch]);

  return (
    <ThemeProvider theme={WarmVanillaTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
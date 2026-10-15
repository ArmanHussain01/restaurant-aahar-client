import { Routes, Route } from "react-router-dom";
import Cart from "../component/cart/Cart";
import SearchPage from "../component/foodSearch/SearchPage";
import Home from "../component/home/Home";
import Profile from "../component/profile/Profile";
import { Navbar } from "../component/navbar/Navbar";
import RestaurantDetails from "../component/restaurant/RestaurantDetail";
import AuthRoutes from "../../auth/routes/AuthRoutes";
import Auth from "../../auth/component/Auth";
import DeliveryNotificationListener from "../component/notification/DeliveryNotificationListener";
import CustomerOrderTracking from "../component/tracking/CustomerOrderTracking";

const CustomerRoute = () => {
  return (
    <div>
      <Navbar />
      <DeliveryNotificationListener />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/restaurant/:city/:title/:id"
          element={<RestaurantDetails />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/my-profile/*" element={<Profile />} />
        <Route
          path="/track-order/:orderId"
          element={<CustomerOrderTracking />}
        />
        <Route path="/account/*" element={<AuthRoutes />} />
      </Routes>
      <Auth />
    </div>
  );
};

export default CustomerRoute;

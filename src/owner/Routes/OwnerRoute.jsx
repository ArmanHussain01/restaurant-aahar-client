import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Owner } from "../component/Owner/Owner";
import CreateRestaurantForm from "../component/CreateRestaurantForm/CreateRestaurantFrom";
import OrderDetail from "../component/Orders/OrderDetail";

const OwnerRoute = () => {
  const { usersRestaurant, loadingUserRestaurant } = useSelector(
    (store) => store.restaurant,
  );

  if (loadingUserRestaurant) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={usersRestaurant ? <Owner /> : <CreateRestaurantForm />}
      />
      <Route path="/orders/:orderId" element={<OrderDetail />} />
    </Routes>
  );
};

export default OwnerRoute;

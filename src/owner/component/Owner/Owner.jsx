import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import OwnerSideBar from "./OwnerSideBar";

import Orders from "../Orders/Orders";
import Menu from "../Menu/Menu";
import FoodCategory from "../FoodCategory/FoodCategory";
import Ingredients from "../Ingredients/Ingredients";
import Events from "../Events/Events";
import RestaurantDetails from "./RestaurantDetails";
import RestaurantDashBoard from "../RestaurantDashBoard/RestaurantDeshBoard";
import CreateMenuForm from "../Menu/CreateMenuFrom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantById,
  getRestaurantsCategory,
} from "../../../customer/state/restaurant/Action";
import { getMenuItemsByRestaurantId } from "../../../customer/state/menu/Action";
import { getUsersOrders } from "../../../customer/state/order/Action";
import { fetchRestaurantOrders } from "../../state/restaurantOrders/Action";
import Staff from "../Staff/Staff";
import Expense from "../Expense/Expense";
import CreateStaffForm from "../Staff/CreateStaffForm";
import UpdateStaffDetails from "../Staff/UpdateStaffDetails";
import CreateExpenseForm from "../Expense/CreateExpenseForm";
import UpdateExpenseForm from "../Expense/UpdateExpenseForm";

export const Owner = () => {
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      getRestaurantsCategory({
        restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      fetchRestaurantOrders({
        restaurantId,
        jwt,
      }),
    );
  }, [dispatch, restaurantId]);

  return (
    <div className="lg:flex">
      <div className="lg:w-[18vw]">
        <OwnerSideBar handleClose={() => {}} />
      </div>

      <div className="lg:w-[82vw] min-h-screen p-5">
        <Routes>
          <Route path="/" element={<RestaurantDashBoard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/category" element={<FoodCategory />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/events" element={<Events />} />
          <Route path="/details" element={<RestaurantDetails />} />
          <Route path="/add-menu" element={<CreateMenuForm />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/add-staff" element={<CreateStaffForm />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/add-expense" element={<CreateExpenseForm />} />
          <Route path="/update-expense" element={<UpdateExpenseForm />} />
          <Route path="/update-staff" element={<UpdateStaffDetails />} />
        </Routes>
      </div>
    </div>
  );
};

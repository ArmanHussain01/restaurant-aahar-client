import {
  applyMiddleware,
  combineReducers,
  legacy_createStore,
} from "@reduxjs/toolkit";
import { authReducer } from "../auth/state/authentication/Reducer";
import { thunk } from "redux-thunk";
import restaurantReducer from "../customer/state/restaurant/Reducer";
import menuItemReducer from "../customer/state/menu/Reducer";
import cartReducer from "../customer/state/cart/Reducer";
import orderReducer from "../customer/state/order/Reducer";
import ingredientReducer from "../owner/state/ingredients/Reducer";
import restaurantOrdersReducer from "../owner/state/restaurantOrders/Reducer";
import resetReducer from "../auth/state/resetOtp/Reducer";
import staffReducer from "../owner/state/staff/Reducer";
import expenseReducer from "../owner/state/expense/Reducer";
import analyticsReducer from "../owner/state/analytics/Reducer";
import { foodSearchReducer } from "../customer/state/search/reducer";
import deliveryReducer from "../delivery/state/delivery/Reducer";
import trackingReducer from "../customer/state/tracking/Reducer";

const rooteReducer = combineReducers({
  auth: authReducer,
  reset: resetReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  cart: cartReducer,
  order: orderReducer,
  restaurantOrder: restaurantOrdersReducer,
  ingredients: ingredientReducer,
  staff: staffReducer,
  expense: expenseReducer,
  foodSearch: foodSearchReducer,
  analytics: analyticsReducer,
  delivery: deliveryReducer, // delivery/state/delivery/Reducer
  tracking: trackingReducer, // customer/state/tracking/Reducer
});

export const store = legacy_createStore(rooteReducer, applyMiddleware(thunk));

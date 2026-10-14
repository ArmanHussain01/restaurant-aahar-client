import api from '../../../shared/config/api'

import {
  CREATE_MENU_ITEM_FAILURE,
  CREATE_MENU_ITEM_REQUEST,
  CREATE_MENU_ITEM_SUCCESS,
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQUEST,
  DELETE_MENU_ITEM_SUCCESS,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_REQUEST,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEM_AVAILABILITY_REQUEST,
  UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
} from "./ActionTypes";

// CREATE MENU ITEM
export const createMenuItem = ({ menu, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_MENU_ITEM_REQUEST,
    });

    try {
      const { data } = await api.post("/api/admin/food", menu, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("Menu item created:", data);

      dispatch({
        type: CREATE_MENU_ITEM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("Create menu item error:", error);

      dispatch({
        type: CREATE_MENU_ITEM_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};


export const getMenuItemsByRestaurantId = ({
  restaurantId,
  vegetarian,
  seasonal,
  available,
  foodCategory = "",
  page = 0,
  size = 10,
  jwt,
}) => {
  return async (dispatch) => {
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });

    try {
      const params = { page, size };

      if (typeof vegetarian === "boolean") params.vegetarian = vegetarian;
      if (typeof seasonal === "boolean") params.seasonal = seasonal;
      if (typeof available === "boolean") params.available = available;
      if (foodCategory) params.food_category = foodCategory;

      const authHeader = jwt?.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;

      const { data } = await api.get(`/api/food/restaurant/${restaurantId}`, {
        params,
        headers: { Authorization: authHeader },
      });

      dispatch({
        type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

// SEARCH MENU ITEM
export const searchMenuItem = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_MENU_ITEM_REQUEST,
    });

    try {
      const { data } = await api.get("/api/food/search", {
        params: {
          name: keyword,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("Search menu item:", data);

      dispatch({
        type: SEARCH_MENU_ITEM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("Search menu item error:", error);

      dispatch({
        type: SEARCH_MENU_ITEM_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

// UPDATE MENU ITEM AVAILABILITY
export const updateMenuItemAvailability = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_MENU_ITEM_AVAILABILITY_REQUEST,
    });

    try {
      const { data } = await api.put(
        `/api/admin/food/${foodId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      console.log("Updated menu item availability:", data);

      dispatch({
        type: UPDATE_MENU_ITEM_AVAILABILITY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("Update menu item availability error:", error);

      dispatch({
        type: UPDATE_MENU_ITEM_AVAILABILITY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

// DELETE MENU ITEM
export const deleteMenuItem = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_MENU_ITEM_REQUEST,
    });

    try {
      const { data } = await api.delete(`/api/admin/food/${foodId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("Deleted menu item:", data);

      dispatch({
        type: DELETE_MENU_ITEM_SUCCESS,
        payload: foodId,
      });
    } catch (error) {
      console.log("Delete menu item error:", error);

      dispatch({
        type: DELETE_MENU_ITEM_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

import api from "../../../shared/config/api";
import * as actionTypes from "./ActionTypes";

export const getIngredientsOfRestaurant = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.get(
        `/api/admin/ingredients/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      console.log("get all ingredients:", data);

      dispatch({
        type: actionTypes.GET_INGREDIENTS,
        payload: data,
      });
    } catch (error) {
      console.error(
        "get ingredients error:",
        error.response?.data || error.message,
      );
    }
  };
};

export const createIngredientCategory = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.CREATE_INGREDIENT_CATEGORY_REQUEST,
    });

    try {
      const { data: responseData } = await api.post(
        "/api/admin/ingredients/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      console.log("Created ingredient category:", responseData);

      dispatch({
        type: actionTypes.CREATE_INGREDIENT_CATEGORY_SUCCESS,
        payload: responseData,
      });
    } catch (error) {
      console.error(
        "Create ingredient category error:",
        error.response?.data || error.message,
      );

      dispatch({
        type: actionTypes.CREATE_INGREDIENT_CATEGORY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

export const createIngredientItem = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.CREATE_INGREDIENT_ITEM_REQUEST,
    });

    try {
      const { data: responseData } = await api.post(
        `/api/admin/ingredients/restaurant/${data.restaurantId}`,
        null,
        {
          params: {
            ingredientName: data.ingredientName,
            categoryId: data.categoryId,
            unitCost: data.unitCost,
            unit: data.unit,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Created ingredient item successfully:", responseData);

      dispatch({
        type: actionTypes.CREATE_INGREDIENT_ITEM_SUCCESS,
        payload: responseData,
      });
    } catch (error) {
      console.error(
        "Create ingredient item error:",
        error.response?.data || error.message
      );

      dispatch({
        type: actionTypes.CREATE_INGREDIENT_ITEM_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

export const getIngredientCategory = ({ id, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.GET_INGREDIENT_CATEGORY_REQUEST,
    });

    try {
      const { data } = await api.get(
        `/api/admin/ingredients/restaurant/${id}/category`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      console.log("get ingredient category:", data);

      dispatch({
        type: actionTypes.GET_INGREDIENT_CATEGORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error(
        "get ingredient category error:",
        error.response?.data || error.message,
      );

      dispatch({
        type: actionTypes.GET_INGREDIENT_CATEGORY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
};

export const updateStockOfIngredient = ({ id, jwt }) => {
  return async (dispatch) => {
    try {
      const { data } = await api.put(
        `/api/admin/ingredients/restaurant/${id}/stock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      console.log("updated ingredient stock", data);

      dispatch({
        type: actionTypes.UPDATE_STOCK,
        payload: data,
      });
    } catch (error) {
      console.log("update stock error", error);
    }
  };
};

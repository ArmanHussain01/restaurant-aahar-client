import api from "../../../shared/config/api";

import {
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  CREATE_EXPENSE_FAILURE,

  GET_EXPENSE_REQUEST,
  GET_EXPENSE_SUCCESS,
  GET_EXPENSE_FAILURE,

  GET_RESTAURANT_EXPENSE_REQUEST,
  GET_RESTAURANT_EXPENSE_SUCCESS,
  GET_RESTAURANT_EXPENSE_FAILURE,

  UPDATE_EXPENSE_REQUEST,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,

  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,

  CLEAR_EXPENSE_ERROR,
} from "./ActionTypes";


export const createExpense =
  (restaurantId, expenseData,jwt) => async (dispatch) => {

    dispatch({
      type: CREATE_EXPENSE_REQUEST,
      
    });

    try {

      const response = await api.post(
        `/api/admin/expenses/${restaurantId}`,
        expenseData,
          {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      );

      dispatch({
        type: CREATE_EXPENSE_SUCCESS,
        payload: response.data,
      });

      console.log("ex", response.data);
      

    } catch (error) {

      dispatch({
        type: CREATE_EXPENSE_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to create expense",
      });

    }
  };


// GET EXPENSE BY ID
export const getExpense =
  (expenseId,jwt) => async (dispatch) => {

    dispatch({
      type: GET_EXPENSE_REQUEST,
    });

    try {

      const response = await api.get(
        `/api/admin/expenses${expenseId}`,
          {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      );

      dispatch({
        type: GET_EXPENSE_SUCCESS,
        payload: response.data,
      });

    } catch (error) {

      dispatch({
        type: GET_EXPENSE_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch expense",
      });

    }
  };


export const getRestaurantExpenses =
  (restaurantId,jwt) => async (dispatch) => {

    dispatch({
      type: GET_RESTAURANT_EXPENSE_REQUEST,
    });

    try {

      const response = await api.get(
        `/api/admin/expenses/restaurant/${restaurantId}`,
          {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      );

      dispatch({
        type: GET_RESTAURANT_EXPENSE_SUCCESS,
        payload: response.data,
      });

    } catch (error) {

      dispatch({
        type: GET_RESTAURANT_EXPENSE_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch restaurant expenses",
      });

    }
  };


export const updateExpense =
  (expenseId, expenseData,jwt) => async (dispatch) => {

    dispatch({
      type: UPDATE_EXPENSE_REQUEST,
    });

    try {

      const response = await api.put(
        `/api/admin/expenses/${expenseId}`,
        expenseData,
          {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      );

      dispatch({
        type: UPDATE_EXPENSE_SUCCESS,
        payload: response.data,
      });

    } catch (error) {

      dispatch({
        type: UPDATE_EXPENSE_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to update expense",
      });

    }
  };

export const deleteExpense =
  (expenseId,jwt) => async (dispatch) => {

    dispatch({
      type: DELETE_EXPENSE_REQUEST,
    });

    try {

      await api.delete(
        `/api/admin/expenses/${expenseId}`,
          {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      );

      dispatch({
        type: DELETE_EXPENSE_SUCCESS,
        payload: expenseId,
      });

    } catch (error) {

      dispatch({
        type: DELETE_EXPENSE_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete expense",
      });

    }
  };


export const clearExpenseError = () => ({
  type: CLEAR_EXPENSE_ERROR,
});
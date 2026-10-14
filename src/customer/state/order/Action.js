import  api from "../../../shared/config/api";
import { getUser } from "../../../auth/state/authentication/Action";
import * as actionTypes from "./ActionTypes";




export const createOrder = (reqData) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.CREATE_ORDER_REQUEST,
    });

    try {
      const { data } = await api.post(
        "api/order",
        reqData.orderData,
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );


      dispatch({
        type: actionTypes.CREATE_ORDER_SUCCESS,
        payload: data,
      });

    
      if (reqData.jwt) {
        dispatch(getUser(reqData.jwt));
      }

    } catch (error) {
      console.log("create order error", error);

      dispatch({
        type: actionTypes.CREATE_ORDER_FAILURE,
        payload: error.message,
      });
    }
  };
};


export const getUsersOrders = (jwt) => {
  return async (dispatch) => {

    dispatch({
      type: actionTypes.GET_USERS_ORDER_REQUEST,
    });

    try {

      const { data } = await api.get(
        "api/order/user",
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: actionTypes.GET_USERS_ORDER_SUCCESS,
        payload: data,
      });

    } catch (error) {

      console.log("get users orders error", error);

      dispatch({
        type: actionTypes.GET_USERS_ORDER_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchOrderById = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_ORDER_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: actionTypes.GET_ORDER_BY_ID_SUCCESS,
      payload: data,
    });

    console.log("data orde",data);
    
    return data;
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    console.log("error",error.message);
    

    dispatch({
      type: actionTypes.GET_ORDER_BY_ID_FAILURE,
      payload: errorMessage,
    });
  }
};
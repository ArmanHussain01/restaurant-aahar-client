import api from "../../../shared/config/api";
import * as actionTypes from "./ActionTypes";

export const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.UPDATE_ORDER_STATUS_REQUEST,
    });

    try {
      const { data } = await api.put(
        `/admin/api/orders/${orderId}/${orderStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

   //   console.log("update order data", data);

      dispatch({
        type: actionTypes.UPDATE_ORDER_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("update order error", error);

      dispatch({
        type: actionTypes.UPDATE_ORDER_STATUS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchRestaurantOrders =
  ({ restaurantId, orderStatus, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.GET_RESTAURANTS_ORDER_REQUEST,
    });

    try {
      const { data } = await api.get(`/admin/api/orders/${restaurantId}`, {
        params: {
          order_status: orderStatus,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: actionTypes.GET_RESTAURANTS_ORDER_SUCCESS,
        payload: data,
      });

     // console.log("Fetch restaurant orders data:", data);
      
    } catch (error) {
      console.error("Get restaurant orders error:", error);

      dispatch({
        type: actionTypes.GET_RESTAURANTS_ORDER_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

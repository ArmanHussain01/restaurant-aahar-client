import  api  from "../../../shared/config/api";
import * as actionTypes from "./ActionTypes";

export const findCart = (token) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.FIND_CART_REQUEST,
    });

    try {
      const response = await api.get("api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      dispatch({
        type: actionTypes.FIND_CART_SUCCESS,
        payload: response.data,
      });

      console.log("find cart details",response.data);
      
    } catch (error) {
      console.log("find cart error", error);

      dispatch({
        type: actionTypes.FIND_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const getAllCartItem = (reqData) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.GET_ALL_CART_ITEMS_REQUEST,
    });

    try {
      const response = await api.get(`api/carts/${reqData.cartId}/items`, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });

      dispatch({
        type: actionTypes.GET_ALL_CART_ITEMS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log("get all cart items error", error);

      dispatch({
        type: actionTypes.GET_ALL_CART_ITEMS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const addItemToCart = (reqData) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.ADD_ITEM_TO_CART_REQUEST,
    });

    try {
      const { data } = await api.post("api/cart/add", reqData.cartItem, {
        headers: {
          Authorization: `Bearer ${reqData.token}`,
        },
      });

      dispatch({
        type: actionTypes.ADD_ITEM_TO_CART_SUCCESS,
        payload: data,
      });

      console.log("add item to cart",data);
      
    } catch (error) {
      console.log("add item to cart error", error);

      dispatch({
        type: actionTypes.ADD_ITEM_TO_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const updateCartItem = ({ data, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.UPDATE_CARTITEMS_REQUEST,
    });

    try {
      const { data: responseData } = await api.put(
        "/api/cartItem/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("update cartItem", responseData);

      dispatch({
        type: actionTypes.UPDATE_CARTITEMS_SUCCESS,
        payload: responseData,
      });
    } catch (error) {
      console.log("update cartItem error", error);

      dispatch({
        type: actionTypes.UPDATE_CARTITEMS_FAILURE,
        payload:
          error.response?.data?.message || error.message,
      });
    }
  };
};

export const removeCartItem = ({ cartItemId, jwt }) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.REMOVE_CARTITEMS_REQUEST,
    });

    try {
      const { data } = await api.delete(`api/cartItem/${cartItemId}/remove`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      console.log("remove cartItem", data);

      dispatch({
        type: actionTypes.REMOVE_CARTITEMS_SUCCESS,
        payload: cartItemId,
      });
    } catch (error) {
      console.log("remove cartItem error", error);

      dispatch({
        type: actionTypes.REMOVE_CARTITEMS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const clearCartItem = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.CLEAR_CART_REQUEST,
    });

    try {
      const { data } = await api.put(
        "api/cart/clear",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        },
      );

      console.log("clear cart", data);

      dispatch({
        type: actionTypes.CLEAR_CART_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("clear cart error", error);

      dispatch({
        type: actionTypes.CLEAR_CART_FAILURE,
        payload: error.message,
      });
    }
  };
};

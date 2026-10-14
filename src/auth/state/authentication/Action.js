import {
  ADD_TO_FAVORITE_FAILURE,
  ADD_TO_FAVORITE_REQUEST,
  ADD_TO_FAVORITE_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionType";

import api from "../../../shared/config/api";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { data } = await api.post("/auth/signup", reqData.userData);

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }

    dispatch({
      type: REGISTER_SUCCESS,
      payload: data.jwt,
    });

    await dispatch(getUser(data.jwt));

    if (data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/owner/restaurants");
    } else {
      reqData.navigate("/");
    }

    console.log("Register success:", data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      "Registration failed. Please try again.";

    dispatch({
      type: REGISTER_FAILURE,
      payload: errorMessage,
    });

    console.error("Register error:", error);
  }
};

export const loginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await api.post("/auth/signin", reqData.userData);

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.jwt,
    });

    await dispatch(getUser(data.jwt));

    if (data.role === "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/owner/restaurants");
    } else if (data.role === "ROLE_DELIVERY_PARTNER") {
      reqData.navigate("/delivery");
    } else {
      reqData.navigate("/");
    }

    console.log("Login success:", data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      "Invalid email or password";

    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage,
    });

    console.error("Login error:", error);
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const { data } = await api.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_USER_SUCCESS,
      payload: data,
    });

    console.log("User profile:", data);
  } catch (error) {
    dispatch({
      type: GET_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });

    console.error("Get user error:", error);
  }
};

export const addToFavorites = (jwt, restaurantId) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITE_REQUEST });

  try {
    const { data } = await api.put(
      `/api/restaurants/${restaurantId}/add_favorites`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    dispatch({
      type: ADD_TO_FAVORITE_SUCCESS,
      payload: data,
    });

    console.log("Added to favorites:", data);
  } catch (error) {
    dispatch({
      type: ADD_TO_FAVORITE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });

    console.error("Add to favorites error:", error);
  }
};

export const logOut = () => (dispatch) => {
  localStorage.removeItem("jwt");

  dispatch({
    type: LOGOUT,
  });

  console.log("Logout success");
};

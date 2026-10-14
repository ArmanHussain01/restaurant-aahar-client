import api from "../../../shared/config/api";

// import {
//   FORGET_PASSWORD_REQUEST,
//   FORGET_PASSWORD_SUCCESS,
//   FORGET_PASSWORD_FAILURE,
//   RESET_PASSWORD_REQUEST,
//   RESET_PASSWORD_SUCCESS,
//   RESET_PASSWORD_FAILURE,
//   VARIFY_OPT_REQUEST,
//   VARIFY_OPT_SUCCESS,
//   VARIFY_OPT_FAILURE,
// } from "./ActionType";
import {
  RESET_AUTH_STATE,
  FORGET_PASSWORD_REQUEST,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  VARIFY_OPT_REQUEST,
  VARIFY_OPT_SUCCESS,
  VARIFY_OPT_FAILURE,
} from "./ActionTypes";

export const forgetPassword = (email) => async (dispatch) => {
  dispatch({
    type: FORGET_PASSWORD_REQUEST,
  });

  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    dispatch({
      type: FORGET_PASSWORD_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FORGET_PASSWORD_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const verifyOtp = (data) => async (dispatch) => {
  dispatch({
    type: VARIFY_OPT_REQUEST,
  });

  try {
    const response = await api.post("/auth/verify-otp", data);

    dispatch({
      type: VARIFY_OPT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: VARIFY_OPT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const resetPassword = (data) => async (dispatch) => {
  dispatch({
    type: RESET_PASSWORD_REQUEST,
  });

  try {
    const response = await api.post("/auth/reset-password", data);

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Password reset failed",
    });
  }
};

export const resetAuthState = () => ({
  type: RESET_AUTH_STATE,
});

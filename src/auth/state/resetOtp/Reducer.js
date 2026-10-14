import * as actionTypes from "./ActionTypes";

const initialState = {
  loading: false,
  otpSent: false,
  otpVerified: false,
  passwordReset: false,
  message: null,
  error: null,
};

const resetReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FORGET_PASSWORD_REQUEST:
    case actionTypes.VARIFY_OPT_REQUEST:
    case actionTypes.RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null };

    case actionTypes.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        otpSent: true,
        message: action.payload,
        error: null,
      };

    case actionTypes.VARIFY_OPT_SUCCESS:
      return {
        ...state,
        loading: false,
        otpVerified: true,
        message: action.payload,
        error: null,
      };

    case actionTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        otpSent: false,
        otpVerified: false,
        passwordReset: true,
        message: action.payload,
        error: null,
      };

    case actionTypes.FORGET_PASSWORD_FAILURE:
    case actionTypes.VARIFY_OPT_FAILURE:
    case actionTypes.RESET_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.RESET_AUTH_STATE:
      return initialState;

    default:
      return state;
  }
};

export default resetReducer;
import * as actionTypes from "./ActionTypes";

const initialState = {
  loading: false,
  orders: [],
  currentOrder: null, 
  error: null,
  notifications: [],
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_ORDER_REQUEST:
    case actionTypes.GET_USERS_ORDER_REQUEST:
    case actionTypes.GET_ORDER_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: action.payload,
      };

    case actionTypes.GET_USERS_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        orders: action.payload,
      };

    case actionTypes.GET_ORDER_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        currentOrder: action.payload,
      };

    case actionTypes.CREATE_ORDER_FAILURE:
    case actionTypes.GET_USERS_ORDER_FAILURE:
    case actionTypes.GET_ORDER_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
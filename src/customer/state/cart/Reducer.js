import { LOGOUT } from "../../../auth/state/authentication/ActionType";
import * as actionTypes from "./ActionTypes";

const initialState = {
  cart: null,
  cartItems: [],
  loading: false,
  updating: false,
  removing: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FIND_CART_REQUEST:
    case actionTypes.GET_ALL_CART_ITEMS_REQUEST:
    case actionTypes.ADD_ITEM_TO_CART_REQUEST:
    case actionTypes.CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.REMOVE_CARTITEMS_REQUEST:
      return {
        ...state,
        removing: true,
        error: null,
      };

    case actionTypes.UPDATE_CARTITEMS_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };

    case actionTypes.FIND_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload.items || [],
        error: null,
      };

    case actionTypes.GET_ALL_CART_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: action.payload,
        error: null,
      };

    case actionTypes.ADD_ITEM_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: [...state.cartItems, action.payload],
        error: null,
      };

    case actionTypes.UPDATE_CARTITEMS_SUCCESS: {
      const updatedItem = action.payload;

      const updatedCartItems = state.cartItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      );

      const updatedTotal = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        updating: false,

        cartItems: updatedCartItems,

        cart: state.cart
          ? {
              ...state.cart,
              items: updatedCartItems,
              total: updatedTotal,
            }
          : state.cart,

        error: null,
      };
    }

    case actionTypes.REMOVE_CARTITEMS_SUCCESS: {
      const updatedCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );

      const updatedTotal = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        removing: false,

        cartItems: updatedCartItems,

        cart: state.cart
          ? {
              ...state.cart,
              items: updatedCartItems,
              total: updatedTotal,
            }
          : state.cart,

        error: null,
      };
    }

    case actionTypes.CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: [],
        error: null,
      };

    case actionTypes.UPDATE_CARTITEMS_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    case actionTypes.REMOVE_CARTITEMS_FAILURE:
      return {
        ...state,
        removing: false,
        error: action.payload,
      };

    case actionTypes.FIND_CART_FAILURE:
    case actionTypes.GET_ALL_CART_ITEMS_FAILURE:
    case actionTypes.ADD_ITEM_TO_CART_FAILURE:
    case actionTypes.CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      localStorage.removeItem("jwt");

      return {
        ...state,
        cart: null,
        cartItems: [],
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default cartReducer;

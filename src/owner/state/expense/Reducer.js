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

const initialState = {
  expenses: [],
  expense: null,
  loading: false,
  error: null,
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXPENSE_REQUEST:
    case GET_EXPENSE_REQUEST:
    case GET_RESTAURANT_EXPENSE_REQUEST:
    case UPDATE_EXPENSE_REQUEST:
    case DELETE_EXPENSE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: [action.payload, ...state.expenses],
      };

    case GET_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expense: action.payload,
      };

    case GET_RESTAURANT_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: action.payload,
      };

    case UPDATE_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: state.expenses.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: state.expenses.filter((item) => item.id !== action.payload),
      };

    case CREATE_EXPENSE_FAILURE:
    case GET_EXPENSE_FAILURE:
    case GET_RESTAURANT_EXPENSE_FAILURE:
    case UPDATE_EXPENSE_FAILURE:
    case DELETE_EXPENSE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_EXPENSE_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default expenseReducer;

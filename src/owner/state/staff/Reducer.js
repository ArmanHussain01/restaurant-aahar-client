import {
  CREATE_STAFF_REQUEST,
  CREATE_STAFF_SUCCESS,
  CREATE_STAFF_FAILURE,
  GET_STAFF_REQUEST,
  GET_STAFF_SUCCESS,
  GET_STAFF_FAILURE,
  GET_RESTAURANT_STAFF_REQUEST,
  GET_RESTAURANT_STAFF_SUCCESS,
  GET_RESTAURANT_STAFF_FAILURE,
  UPDATE_STAFF_REQUEST,
  UPDATE_STAFF_SUCCESS,
  UPDATE_STAFF_FAILURE,
  UPDATE_STAFF_STATUS_REQUEST,
  UPDATE_STAFF_STATUS_SUCCESS,
  UPDATE_STAFF_STATUS_FAILURE,
  CLEAR_STAFF_ERROR,
} from "./ActionTypes";

const initialState = {
  staff: null,
  staffList: [],

  loading: false,
  error: null,

  createdStaff: null,
  updatedStaff: null,
};

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STAFF_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        createdStaff: action.payload,
        staffList: [...state.staffList, action.payload],
      };

    case CREATE_STAFF_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_STAFF_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staff: action.payload,
      };

    case GET_STAFF_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_RESTAURANT_STAFF_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_RESTAURANT_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staffList: action.payload,
      };

    case GET_RESTAURANT_STAFF_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_STAFF_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedStaff: action.payload,

        staff:
          state.staff?.id === action.payload?.id ? action.payload : state.staff,

        staffList: state.staffList.map((item) =>
          item.id === action.payload?.id ? action.payload : item,
        ),
      };

    case UPDATE_STAFF_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_STAFF_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_STAFF_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,

        staff:
          state.staff?.id === action.payload?.id ? action.payload : state.staff,

        staffList: state.staffList.map((item) =>
          item.id === action.payload?.id ? action.payload : item,
        ),
      };

    case UPDATE_STAFF_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_STAFF_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default staffReducer;

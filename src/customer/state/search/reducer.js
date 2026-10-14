import {
  CLEAR_FOOD_SEARCH,
  POPULAR_SEARCHES_FAILURE,
  POPULAR_SEARCHES_REQUEST,
  POPULAR_SEARCHES_SUCCESS,
  SEARCH_FOOD_FAILURE,
  SEARCH_FOOD_REQUEST,
  SEARCH_FOOD_SUCCESS,
} from "./actionType";

const initialState = {
  foods: [],
  loading: false,
  error: null,
  keyword: "",
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  popularSearches: [],
  popularLoading: false,
  popularLoaded: false,
};

export const foodSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_FOOD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        keyword: action.payload.keyword,
        page: action.payload.page,
        size: action.payload.size,
      };
    case SEARCH_FOOD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        foods: action.payload.content || [],
        totalElements: action.payload.totalElements ?? 0,
        totalPages: action.payload.totalPages ?? 0,
        size: action.payload.size ?? state.size,
        page: action.payload.number ?? state.page,
      };
    case SEARCH_FOOD_FAILURE:
      return { ...state, loading: false, error: action.payload, foods: [] };
    case CLEAR_FOOD_SEARCH:
      return {
        ...state,
        foods: [],
        loading: false,
        error: null,
        keyword: "",
        page: 0,
        totalPages: 0,
        totalElements: 0,
      };
    case POPULAR_SEARCHES_REQUEST:
      return { ...state, popularLoading: true };
    case POPULAR_SEARCHES_SUCCESS:
      return {
        ...state,
        popularLoading: false,
        popularLoaded: true,
        popularSearches: action.payload,
      };
    case POPULAR_SEARCHES_FAILURE:
      // Non-critical: leave popularLoaded false so a later visit can retry.
      return { ...state, popularLoading: false };
    default:
      return state;
  }
};

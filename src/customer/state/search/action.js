import { isCancel } from "axios";

import api from "../../../shared/config/api";
import {
  CLEAR_FOOD_SEARCH,
  POPULAR_SEARCHES_FAILURE,
  POPULAR_SEARCHES_REQUEST,
  POPULAR_SEARCHES_SUCCESS,
  SEARCH_FOOD_FAILURE,
  SEARCH_FOOD_REQUEST,
  SEARCH_FOOD_SUCCESS,
} from "./actionType";


let activeController = null;
let latestRequestId = 0;

export const searchFood = (query, jwt) => async (dispatch) => {
  console.log("SEARCH FOOD THUNK CALLED", query);

  const {
    name,
    page = 0,
    size = 10,
    sortBy,
    direction,
    vegetarian,
    seasonal,
    available,
  } = query;

  if (activeController) {
    activeController.abort();
  }
  activeController = new AbortController();
  const requestId = ++latestRequestId;

  dispatch({
    type: SEARCH_FOOD_REQUEST,
    payload: { keyword: name, page, size },
  });

  const params = { name, page, size };
  if (sortBy) {
    params.sortBy = sortBy;
    params.direction = direction || "asc";
  }

  if (vegetarian) params.vegetarian = true;
  if (seasonal) params.seasonal = true;
  if (available) params.available = true;

  try {
    const { data } = await api.get("/api/food/search", {
      params,
      headers: { Authorization: `Bearer ${jwt}` },
      signal: activeController.signal,
    });
    
    console.log("4.debug", data);

    if (requestId !== latestRequestId) return;
    dispatch({ type: SEARCH_FOOD_SUCCESS, payload: data });
    console.log("Search results:", data);
  } catch (error) {
    if (isCancel(error) || error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
      console.log("Previous request aborted successfully");
      return;
    }
    if (requestId !== latestRequestId) return;

    dispatch({
      type: SEARCH_FOOD_FAILURE,
      payload:
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load search results.",
    });
  }
};

export const clearFoodSearch = () => (dispatch) => {
  activeController?.abort();
  latestRequestId++;
  dispatch({ type: CLEAR_FOOD_SEARCH });
};

export const fetchPopularSearches = (jwt) => async (dispatch, getState) => {
  
  dispatch({ type: POPULAR_SEARCHES_REQUEST });
  try {
    const { data } = await api.get("/api/food/popular-searches", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    
    dispatch({
      type: POPULAR_SEARCHES_SUCCESS,
      payload: Array.isArray(data) ? data.filter(Boolean) : [],
    });
    console.log("Search results:", data);
  } catch (error) {
    // console.error("3. API Error:", error);
    dispatch({ type: POPULAR_SEARCHES_FAILURE, payload: error?.message });
  }
};

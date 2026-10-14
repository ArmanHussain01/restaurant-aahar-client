import api from "../../../shared/config/api";

import {
  CREATE_RESTAURANT_REQUEST,
  CREATE_RESTAURANT_SUCCESS,
  CREATE_RESTAURANT_FAILURE,
  GET_ALL_RESTAURANTS_REQUEST,
  GET_ALL_RESTAURANTS_SUCCESS,
  GET_ALL_RESTAURANTS_FAILURE,
  DELETE_RESTAURANT_REQUEST,
  DELETE_RESTAURANT_SUCCESS,
  DELETE_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_REQUEST,
  UPDATE_RESTAURANT_SUCCESS,
  UPDATE_RESTAURANT_FAILURE,
  GET_RESTAURANT_BY_ID_REQUEST,
  GET_RESTAURANT_BY_ID_SUCCESS,
  GET_RESTAURANT_BY_ID_FAILURE,
  GET_RESTAURANT_BY_USER_ID_REQUEST,
  GET_RESTAURANT_BY_USER_ID_SUCCESS,
  GET_RESTAURANT_BY_USER_ID_FAILURE,
  UPDATE_RESTAURANT_STATUS_REQUEST,
  UPDATE_RESTAURANT_STATUS_SUCCESS,
  UPDATE_RESTAURANT_STATUS_FAILURE,
  CREATE_EVENTS_REQUEST,
  CREATE_EVENTS_SUCCESS,
  CREATE_EVENTS_FAILURE,
  GET_ALL_EVENTS_REQUEST,
  GET_ALL_EVENTS_SUCCESS,
  GET_ALL_EVENTS_FAILURE,
  DELETE_EVENTS_REQUEST,
  DELETE_EVENTS_SUCCESS,
  DELETE_EVENTS_FAILURE,
  GET_RESTAURANTS_EVENTS_REQUEST,
  GET_RESTAURANTS_EVENTS_SUCCESS,
  GET_RESTAURANTS_EVENTS_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_RESTAURANTS_CATEGORY_REQUEST,
  GET_RESTAURANTS_CATEGORY_SUCCESS,
  GET_RESTAURANTS_CATEGORY_FAILURE,
} from "./ActionType";


export const createRestaurant = (reqData) => async (dispatch) => {
  dispatch({
    type: CREATE_RESTAURANT_REQUEST,
  });

  try {
    const { data } = await api.post("/api/admin/restaurants", reqData.data, {
      headers: {
        Authorization: `Bearer ${reqData.token}`,
      },
    });

    dispatch({
      type: CREATE_RESTAURANT_SUCCESS,
      payload: data,
    });

    
  } catch (error) {
    dispatch({
      type: CREATE_RESTAURANT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });

    console.error("Create restaurant error:", error);
  }
};

export const getAllRestaurants = (jwt) => async (dispatch) => {
  dispatch({
    type: GET_ALL_RESTAURANTS_REQUEST,
  });
  try {
    const { data } = await api.get("/api/restaurants", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({
      type: GET_ALL_RESTAURANTS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.error("catch error", error);
    dispatch({
      type: GET_ALL_RESTAURANTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteRestaurant = (restaurantId) => async (dispatch) => {
  dispatch({
    type: DELETE_RESTAURANT_REQUEST,
  });

  try {
    const { data } = await api.delete(
      `/api/admin/restaurants/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    dispatch({
      type: DELETE_RESTAURANT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("error", error);

    dispatch({
      type: DELETE_RESTAURANT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateRestaurant =
  (restaurantId, restaurantData) => async (dispatch) => {
    dispatch({
      type: UPDATE_RESTAURANT_REQUEST,
    });

    try {
      const { data } = await api.patch(
        `/api/admin/restaurants/${restaurantId}`,
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: UPDATE_RESTAURANT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("error", error);

      dispatch({
        type: UPDATE_RESTAURANT_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getRestaurantById =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: GET_RESTAURANT_BY_ID_REQUEST,
    });

    try {
      const { data } = await api.get(`/api/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: GET_RESTAURANT_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error("catch error", error);
      dispatch({
        type: GET_RESTAURANT_BY_ID_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getRestaurantByUserId = (jwt) => async (dispatch) => {

  dispatch({
    type: GET_RESTAURANT_BY_USER_ID_REQUEST,
  });

  try {
    const { data } = await api.get("/api/admin/restaurants/user", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_RESTAURANT_BY_USER_ID_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.error(" Restaurant API ERROR:", error);

    dispatch({
      type: GET_RESTAURANT_BY_USER_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateRestaurantStatus =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_RESTAURANT_STATUS_REQUEST,
    });

    try {
      const { data } = await api.put(
        `/api/admin/restaurants/Status/${restaurantId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: UPDATE_RESTAURANT_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error("Update restaurant status error:", error);

      dispatch({
        type: UPDATE_RESTAURANT_STATUS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// EVENT ACTIONS

export const createEvent =
  ({ eventData, jwt, restaurantId }) =>
  async (dispatch) => {
    dispatch({
      type: CREATE_EVENTS_REQUEST,
    });

    try {
      const { data } = await api.post(
        `/api/admin/events/restaurant/${restaurantId}`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      //console.log("created event:", data);

      dispatch({
        type: CREATE_EVENTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log(
        "create event error:",
        error.response?.data || error.response || error,
      );

      dispatch({
        type: CREATE_EVENTS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getAllEvents =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({
      type: GET_ALL_EVENTS_REQUEST,
    });

    try {
      const { data } = await api.get("/api/admin/events/restaurant", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: GET_ALL_EVENTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_EVENTS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const deleteEvent = (eventId, jwt) => async (dispatch) => {
  dispatch({
    type: DELETE_EVENTS_REQUEST,
  });

  try {
    await api.delete(`/api/admin/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: DELETE_EVENTS_SUCCESS,
      payload: eventId, 
    });
  } catch (error) {
    console.log("error", error);

    dispatch({
      type: DELETE_EVENTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getRestaurantsEvents = (restaurantId, jwt) => async (dispatch) => {
  dispatch({
    type: GET_RESTAURANTS_EVENTS_REQUEST,
  });

  try {
    const { data } = await api.get(
      `/api/admin/events/restaurant/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    dispatch({
      type: GET_RESTAURANTS_EVENTS_SUCCESS,
      payload: data,
    });
    console.log("Fetched restaurant events:", data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: GET_RESTAURANTS_EVENTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// CATEGORY ACTIONS

export const createCategory = (categoryData, jwt) => async (dispatch) => {
  dispatch({
    type: CREATE_CATEGORY_REQUEST,
  });

  try {
    const { data } = await api.post(
      "/api/admin/category/create",
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    dispatch({
      type: CREATE_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: CREATE_CATEGORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getRestaurantsCategory =
  ({ restaurantId, jwt }) =>
  async (dispatch) => {
    dispatch({
      type: GET_RESTAURANTS_CATEGORY_REQUEST,
    });

    try {
      const { data } = await api.get(
        `/api/category/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: GET_RESTAURANTS_CATEGORY_SUCCESS,
        payload: data,
      });

     // console.log("Fetched restaurant category:", data);
    } catch (error) {
      console.log("error", error);

      dispatch({
        type: GET_RESTAURANTS_CATEGORY_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

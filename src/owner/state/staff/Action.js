import api from "../../../shared/config/api";
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


export const createStaff =
  ({ restaurantId, staffData, jwt, navigate }) =>
  async (dispatch) => {
    dispatch({
      type: CREATE_STAFF_REQUEST,
    });

    try {
      const response = await api.post(
        `/api/admin/staff/${restaurantId}`,
        staffData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      dispatch({
        type: CREATE_STAFF_SUCCESS,
        payload: response.data,
      });

      //   console.log("staff", response.data);

      if (navigate) {
        navigate();
      }
    } catch (error) {
      console.log("error", error.message);

      dispatch({
        type: CREATE_STAFF_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to create staff",
      });
    }
  };


export const getStaff = (staffId, jwt) => async (dispatch) => {
  dispatch({
    type: GET_STAFF_REQUEST,
  });

  try {
    const response = await api.get(`/api/staff/${staffId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_STAFF_SUCCESS,
      payload: response.data,
    });

    console.log("staff", response.data);
  } catch (error) {
    console.log("error", error.message);

    dispatch({
      type: GET_STAFF_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch staff",
    });
  }
};

export const getRestaurantStaff = (jwt) => async (dispatch) => {
  dispatch({
    type: GET_RESTAURANT_STAFF_REQUEST,
  });

  try {
    const response = await api.get(`/api/admin/staff`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_RESTAURANT_STAFF_SUCCESS,
      payload: response.data,
    });

    // console.log("staff",response.data);
  } catch (error) {
    dispatch({
      type: GET_RESTAURANT_STAFF_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch restaurant staff",
    });
  }
};

export const updateStaff =
  ({ staffId, staffData, jwt, navigate }) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_STAFF_REQUEST,
    });

    try {
      const response = await api.put(`/api/admin/staff/${staffId}`, staffData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: UPDATE_STAFF_SUCCESS,
        payload: response.data,
      });

      if (navigate) {
        navigate();
      }

    //    console.log("updated",response.data);
    } catch (error) {
      dispatch({
        type: UPDATE_STAFF_FAILURE,
        payload:
          error.response?.data?.message ||
          error.message ||
          "Failed to update staff",
      });
    }
  };

export const updateStaffStatus = (staffId, status, jwt) => async (dispatch) => {
  dispatch({
    type: UPDATE_STAFF_STATUS_REQUEST,
  });

  try {
    const response = await api.patch(
      `/api/admin/staff/${staffId}/status`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    dispatch({
      type: UPDATE_STAFF_STATUS_SUCCESS,
      payload: response.data,
    });

   
    
  } catch (error) {
    dispatch({
      type: UPDATE_STAFF_STATUS_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to update staff status",
    });
  }
};

export const clearStaffError = () => ({
  type: CLEAR_STAFF_ERROR,
});

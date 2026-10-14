import api from "../../../shared/config/api";
import {
  DASHBOARD_ANALYTICS_REQUEST,
  DASHBOARD_ANALYTICS_SUCCESS,
  DASHBOARD_ANALYTICS_FAILURE,
  BUSINESS_REPORT_REQUEST,
  BUSINESS_REPORT_FAILURE,
  BUSINESS_REPORT_SUCCESS,
  INVOICE_REPORT_REQUEST,
  INVOICE_REPORT_FAILURE,
  INVOICE_REPORT_SUCCESS,
  BUSINESS_REPORT_DOWNLOAD_REQUEST,
  BUSINESS_REPORT_DOWNLOAD_SUCCESS,
  BUSINESS_REPORT_DOWNLOAD_FAILURE,
  INVOICE_REPORT_DOWNLOAD_REQUEST,
  INVOICE_REPORT_DOWNLOAD_SUCCESS,
  INVOICE_REPORT_DOWNLOAD_FAILURE,
} from "./ActionTypes";

export const fetchDashboardAnalytics =
  (restaurantId, startDate, endDate, jwt) => async (dispatch) => {
    dispatch({ type: DASHBOARD_ANALYTICS_REQUEST });

    try {
      const { data } = await api.get("/api/admin/analytics/dashboard", {
        params: {
          restaurantId,
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: DASHBOARD_ANALYTICS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.log("Analytics error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load analytics.";

      dispatch({
        type: DASHBOARD_ANALYTICS_FAILURE,
        payload: message,
      });
    }
  };

export const fetchBusinessReport =
  (restaurantId, startDate, endDate, jwt) => async (dispatch) => {
    dispatch({ type: BUSINESS_REPORT_REQUEST });
    try {
      const { data } = await api.get("/api/admin/analytics/business-report", {
        params: {
          restaurantId,
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: BUSINESS_REPORT_SUCCESS,
        payload: data,
      });

      console.log("data", data);
    } catch (error) {
      console.log("Report error", error.message);
      dispatch({ type: BUSINESS_REPORT_FAILURE, payload: error.message });
    }
  };

export const fatchInvoiceReport = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: INVOICE_REPORT_REQUEST });

  try {
    const { data } = await api.get(`/api/admin/invoices/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: INVOICE_REPORT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("invoice error", error.message);

    dispatch({
      type: INVOICE_REPORT_FAILURE,
      payload: error.message,
    });
  }
};

export const downloadBusinessReport =
  (restaurantId, startDate, endDate, jwt) => async (dispatch) => {
    dispatch({ type: BUSINESS_REPORT_DOWNLOAD_REQUEST });

    try {
      const response = await api.get(
        "/api/admin/analytics/business-report/pdf",
        {
          params: {
            restaurantId,
            startDate,
            endDate,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          responseType: "blob", 
        },
      );

      dispatch({
        type: BUSINESS_REPORT_DOWNLOAD_SUCCESS,
        payload: response.data,
      });

      return response.data; 
    } catch (error) {
      console.error("Error downloading business report:", error.message);
      dispatch({
        type: BUSINESS_REPORT_DOWNLOAD_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

export const downloadInvoiceReport = (orderId, jwt) => async (dispatch) => {
  dispatch({ type: INVOICE_REPORT_DOWNLOAD_REQUEST });

  try {
    const response = await api.get(`/api/admin/invoices/order/${orderId}/pdf`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_Order_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    dispatch({ type: INVOICE_REPORT_DOWNLOAD_SUCCESS, payload: response.data });
  } catch (error) {
    console.log("invoice error", error.message);
    dispatch({ type: INVOICE_REPORT_DOWNLOAD_FAILURE, payload: error.message });
  }
};

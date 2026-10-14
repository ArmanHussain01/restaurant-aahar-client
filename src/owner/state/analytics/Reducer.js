import {
  DASHBOARD_ANALYTICS_REQUEST,
  DASHBOARD_ANALYTICS_SUCCESS,
  DASHBOARD_ANALYTICS_FAILURE,
  BUSINESS_REPORT_REQUEST,
  BUSINESS_REPORT_SUCCESS,
  BUSINESS_REPORT_FAILURE,
  INVOICE_REPORT_REQUEST,
  INVOICE_REPORT_SUCCESS,
  INVOICE_REPORT_FAILURE,
} from "./ActionTypes";

const initialState = {
  loading: false,
  data: null,
  businessReport: null,
  invoiceReport: null,
  error: null,
};

const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Dashboard
    case DASHBOARD_ANALYTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DASHBOARD_ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };

    case DASHBOARD_ANALYTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Business Report
    case BUSINESS_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BUSINESS_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        businessReport: action.payload,
        error: null,
      };

    case BUSINESS_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Invoice Report
    case INVOICE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case INVOICE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        invoiceReport: action.payload, 
        error: null,
      };

    case INVOICE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default analyticsReducer;
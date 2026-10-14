import * as actionTypes from "./ActionTypes";
const initialState = {
  ingredients: [],
  update: null,
  categories: [],
  loading: false,
  error: null,
};

const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
      };

    case actionTypes.CREATE_INGREDIENT_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_INGREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };

    case actionTypes.CREATE_INGREDIENT_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.CREATE_INGREDIENT_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_INGREDIENT_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,

        ingredients: [...state.ingredients, action.payload],
      };

    case actionTypes.CREATE_INGREDIENT_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.GET_INGREDIENT_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_INGREDIENT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,

        categories: action.payload,
      };

    case actionTypes.GET_INGREDIENT_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.UPDATE_STOCK:
      return {
        ...state,
        update: action.payload, // Optional: keep if you need it elsewhere
        ingredients: state.ingredients.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };

    default:
      return state;
  }
};

export default ingredientReducer;

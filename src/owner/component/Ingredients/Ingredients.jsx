import React, { useEffect } from "react";
import IngredientsTable from "./IngredientTable";
import { Grid } from "@mui/material";
import IngredientCategoryTabe from "./IngredientCategoryTabe";
import { useDispatch, useSelector } from "react-redux";
import { getIngredientCategory, getIngredientsOfRestaurant } from "../../state/ingredients/Action";

const Ingredients = () => {
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant
  );

  const categories = useSelector(
    (store) => store.ingredients.categories
  );

  const ingredients = useSelector(
    (store) => store.ingredients.ingredients
  );

  const restaurantId = usersRestaurant?.id;

  useEffect(() => {
    if (!restaurantId || !jwt) return;

    dispatch(
      getIngredientCategory({
        id: restaurantId,
        jwt,
      })
    );


    dispatch(
      getIngredientsOfRestaurant({
        restaurantId,
        jwt,
      })
    );
  }, [dispatch, restaurantId, jwt]);

  return (
    <div className="px-2">
      <Grid container spacing={2}>

        <Grid item size={{ xs: 12, md: 8, lg: 8 }}>
          <IngredientsTable
            ingredients={ingredients}
            categories={categories}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 4, lg: 4 }}>
          <IngredientCategoryTabe
            categories={categories}
          />
        </Grid>

      </Grid>
    </div>
  );
};

export default Ingredients;

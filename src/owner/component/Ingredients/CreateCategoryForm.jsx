import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientCategory } from "../../state/ingredients/Action";

const CreateCategoryForm = () => {
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;

  const [formData, setFormData] = useState({
    categoryName: "",
    restaurantId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurantId) {
      console.error("Restaurant ID not found");
      return;
    }

    const data = {
      name: formData.categoryName,
      restaurantId: restaurantId,
    };

    dispatch(createIngredientCategory({ data, jwt }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-center text-xl pb-10">
          Create Ingredient Category
        </h1>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            label="Ingredient Category"
            type="text"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.categoryName}
          />

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                padding: "12px 36px",
                backgroundColor: "#c05621",
                "&:hover": { backgroundColor: "#9c4221" },
              }}
            >
              CREATE INGREDIENT CATEGORY
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;

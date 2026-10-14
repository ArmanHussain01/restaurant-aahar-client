import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../../customer/state/restaurant/Action";

const CreateFoodCategory = () => {
  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;

  const [formData, setFormData] = useState({
    categoryName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurantId) {
      console.error("Restaurant ID not found");
      return;
    }

    if (!formData.categoryName.trim()) {
      console.error("Category name is required");
      return;
    }

    const data = {
      name: formData.categoryName,
      restaurantId: {
        id: restaurantId,
      },
    };

    const jwt = localStorage.getItem("jwt");

    dispatch(createCategory(data, jwt));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-center text-xl pb-10">Create Food Category</h1>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            label="Food Category"
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
                "&:hover": {
                  backgroundColor: "#9c4221",
                },
              }}
            >
              CREATE CATEGORY
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFoodCategory;

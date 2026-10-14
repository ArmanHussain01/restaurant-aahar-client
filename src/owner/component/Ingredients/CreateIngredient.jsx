import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientItem } from "../../state/ingredients/Action";

const UNITS = ["GRAM", "KG", "ML", "LITER", "PIECE"];

const CreateIngredient = ({ categories }) => {
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantId = usersRestaurant?.id;

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    unitCost: "",
    unit: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurantId) {
      console.error("Restaurant ID not found");
      return;
    }

    if (!formData.name.trim()) {
      console.error("Ingredient name is required");
      return;
    }

    if (!formData.categoryId) {
      console.error("Ingredient category is required");
      return;
    }

    if (!formData.unitCost || Number(formData.unitCost) < 0) {
      console.error("Unit cost must be zero or greater");
      return;
    }

    if (!formData.unit) {
      console.error("Measurement unit is required");
      return;
    }

    const data = {
      ingredientName: formData.name, // Matches parameter 'ingredientName' in Spring Boot controller
      categoryId: formData.categoryId,
      restaurantId: restaurantId,
      unitCost: parseFloat(formData.unitCost),
      unit: formData.unit,
    };

    dispatch(
      createIngredientItem({
        data,
        jwt,
      }),
    );

    setFormData({
      name: "",
      categoryId: "",
      unitCost: "",
      unit: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-5 w-full max-w-md">
        <h1 className="text-center text-xl font-bold pb-6 text-gray-800">
          Create Ingredient
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ingredient Name */}
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Ingredient Name"
            type="text"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
            required
          />

          {/* Ingredient Category */}
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="category-label">Ingredient Category</InputLabel>
            <Select
              labelId="category-label"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              label="Ingredient Category"
            >
              {categories?.map((category, index) => (
                <MenuItem
                  key={`category-${category.id ?? index}`}
                  value={category.id}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Unit Cost */}
          <TextField
            fullWidth
            id="unitCost"
            name="unitCost"
            label="Unit Cost ($)"
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            variant="outlined"
            onChange={handleInputChange}
            value={formData.unitCost}
            required
          />

          {/* Measurement Unit */}
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="unit-label">Measurement Unit</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              label="Measurement Unit"
            >
              {UNITS.map((unitOption) => (
                <MenuItem key={unitOption} value={unitOption}>
                  {unitOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit */}
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
              CREATE INGREDIENT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIngredient;

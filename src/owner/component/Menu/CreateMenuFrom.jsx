import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";


import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../../state/ingredients/Action";
import { uploadImageToCloudinary } from "../../../shared/util/uploadToCloudaniry";
import { createMenuItem } from "../../../customer/state/menu/Action";

const ALLOWED_UNITS = ["GRAM", "KG", "ML", "LITER", "PIECE"];

const initialValues = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  vegetarian: true,
  seasonal: false,
  images: [],
  ingredients: [
    {
      ingredientId: "",
      quantity: "",
      unit: "GRAM",
    },
  ],
};

const CreateMenuForm = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const { usersRestaurant, categories } = useSelector(
    (store) => store.restaurant
  );

  const { ingredients: ingredientList } = useSelector(
    (store) => store.ingredients
  );

  const restaurantId = usersRestaurant?.id;
  const [uploadImage, setUploadImage] = useState(false);

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

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const formattedIngredients = values.ingredients
        .filter((item) => item.ingredientId && item.quantity)
        .map((item) => ({
          ingredientId: Number(item.ingredientId),
          quantity: Number(item.quantity),
          unit: item.unit,
        }));

      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        categoryId: Number(values.categoryId),
        images: values.images,
        restaurantId: Number(restaurantId),
        vegetarian: Boolean(values.vegetarian),
        seasonal: Boolean(values.seasonal),
        ingredients: formattedIngredients,
      };

      dispatch(createMenuItem({ menu: payload, jwt }));
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadImage(true);

    try {
      const image = await uploadImageToCloudinary(file);

      if (image) {
        formik.setFieldValue("images", [...formik.values.images, image]);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadImage(false);
    }
  };

  const removeImage = (index) => {
    formik.setFieldValue(
      "images",
      formik.values.images.filter((_, i) => i !== index)
    );
  };

  const handleAddIngredientRow = () => {
    formik.setFieldValue("ingredients", [
      ...formik.values.ingredients,
      { ingredientId: "", quantity: "", unit: "GRAM" },
    ]);
  };

  const handleRemoveIngredientRow = (index) => {
    const updatedIngredients = formik.values.ingredients.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("ingredients", updatedIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formik.values.ingredients];
    updatedIngredients[index][field] = value;
    formik.setFieldValue("ingredients", updatedIngredients);
  };

  return (
    <div className="py-10 px-5 flex justify-center min-h-screen">
      <div className="lg:max-w-4xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="font-bold text-3xl text-center py-4 text-gray-800">
          Add New Menu Item
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              hidden
              onChange={handleImageChange}
            />

            <label htmlFor="fileInput">
              <span className="w-24 h-24 flex items-center justify-center p-3 border-2 border-dashed rounded-md border-gray-400 cursor-pointer">
                {uploadImage ? (
                  <CircularProgress size={24} />
                ) : (
                  <AddPhotoAlternateIcon
                    className="text-gray-600"
                    fontSize="large"
                  />
                )}
              </span>
            </label>

            {formik.values.images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-md overflow-hidden"
              >
                <img
                  src={image}
                  alt={`upload-${index}`}
                  className="w-full h-full object-cover"
                />

                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    color: "white",
                    background: "rgba(0,0,0,.5)",
                  }}
                >
                  <CloseIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </div>
            ))}
          </div>

          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid item size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Price */}
            <Grid item size={{ xs: 12, sm:6 }}>
              <TextField
                fullWidth
                type="number"
                name="price"
                label="Price (₹)"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Category */}
            <Grid item size={{ xs: 12, sm:6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  label="Category"
                >
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Vegetarian */}
            <Grid item size={{ xs: 12, sm:6 }}>
              <FormControl fullWidth>
                <InputLabel>Vegetarian</InputLabel>
                <Select
                  name="vegetarian"
                  value={formik.values.vegetarian}
                  onChange={formik.handleChange}
                  label="Vegetarian"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Seasonal */}
            <Grid item size={{ xs: 12, sm:6 }}>
              <FormControl fullWidth>
                <InputLabel>Seasonal</InputLabel>
                <Select
                  name="seasonal"
                  value={formik.values.seasonal}
                  onChange={formik.handleChange}
                  label="Seasonal"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Dynamic Ingredients Section */}
            <Grid item size={{ xs: 12}}>
              <div className="flex justify-between items-center mb-2">
                <Typography variant="h6" className="text-gray-700">
                  Ingredients & Quantity
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddIngredientRow}
                  size="small"
                >
                  Add Ingredient
                </Button>
              </div>

              {formik.values.ingredients.map((item, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  alignItems="center"
                  className="mb-3"
                >
                  {/* Select Ingredient */}
                  <Grid item size={{ xs: 12, sm:5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ingredient</InputLabel>
                      <Select
                        value={item.ingredientId}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "ingredientId",
                            e.target.value
                          )
                        }
                        label="Ingredient"
                      >
                        {ingredientList?.map((ing) => (
                          <MenuItem key={ing.id} value={ing.id}>
                            {ing.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Quantity Input */}
                  <Grid item size={{ xs: 5, sm:3 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  {/* Unit Select */}
                  <Grid item size={{ xs: 5, sm:3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={item.unit}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "unit",
                            e.target.value
                          )
                        }
                        label="Unit"
                      >
                        {ALLOWED_UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Remove Row Button */}
                  <Grid item size={{ xs: 2, sm:1 }}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveIngredientRow(index)}
                      disabled={formik.values.ingredients.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="bg-primary"
            >
              CREATE MENU ITEM
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuForm;
import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  emphasize,
} from "@mui/material";
import { useFormik } from "formik";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadImageToCloudinary } from "../../../shared/util/uploadToCloudaniry";
import { useDispatch } from "react-redux";
import { createRestaurant } from "../../../customer/state/restaurant/Action";

const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  twitter: "",
  instagram: "",
  openingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
  images: [],
};

const CreateRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const formik = useFormik({
    initialValues,

    onSubmit: (values) => {
      const data = {
        name: values.name,
        description: values.description,
        cuisineType: values.cuisineType,

        address: {
          streetAddress: values.streetAddress,
          city: values.city,
          stateProvince: values.stateProvince,
          postalCode: values.postalCode,
          country: values.country,
        },

        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          twitter: values.twitter,
          instagram: values.instagram,
        },

        openingHours: values.openingHours,
        images: values.images,
      };

      console.log("Form Values:", data);

      dispatch(createRestaurant({ data, token: jwt }));
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploadImage(true);

    try {
      const image = await uploadImageToCloudinary(file);

      console.log("image --", image);

      formik.setFieldValue("images", [...formik.values.images, image]);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadImage(false);
    }
  };

  const handleCloseImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 flex items-center justify-center min-h-screen">
      <div className="lg:max-w-4xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="font-bold text-3xl text-center py-4 text-gray-800">
          Add New Restaurant
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* IMAGE UPLOADER - Separated from the form grid */}
          <div className="flex flex-wrap gap-5 items-center mb-6">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label htmlFor="fileInput" className="relative cursor-pointer">
              <span className="w-24 h-24 flex items-center justify-center p-3 border-2 border-dashed rounded-md border-gray-400 hover:border-gray-600 transition">
                <AddPhotoAlternateIcon
                  className="text-gray-600"
                  fontSize="large"
                />
              </span>
              {uploadImage && (
                <div className="absolute inset-0 w-24 h-24 flex justify-center items-center bg-white/70 rounded-md">
                  <CircularProgress size={24} />
                </div>
              )}
            </label>

            {/* Displaying Uploaded Images */}
            <div className="flex flex-wrap gap-3">
              {formik.values.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-md overflow-hidden shadow"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={image}
                    alt={`upload-${index}`}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                      position: "absolute",
                      top: 2,
                      right: 2,
                    }}
                    onClick={() => handleCloseImage(index)}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                onChange={(e) => {
                  formik.handleChange(e);
                  console.log("Description:", e.target.value);
                }}
                value={formik.values.description}
              />
            </Grid>

            {/* Cuisine Type */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="cuisineType"
                name="cuisineType"
                label="Cuisine Type"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.cuisineType}
              />
            </Grid>

            {/* Opening Hours */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="openingHours"
                name="openingHours"
                label="Opening Hours"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.openingHours}
              />
            </Grid>

            {/* Street Address */}
            <Grid size={12}>
              <TextField
                fullWidth
                id="streetAddress"
                name="streetAddress"
                label="Street Address"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.streetAddress}
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.city}
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                id="stateProvince"
                name="stateProvince"
                label="State/Province"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.stateProvince}
              />
            </Grid>

            {/* Postal Code */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                id="postalCode"
                name="postalCode"
                label="Postal Code"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.postalCode}
              />
            </Grid>

            {/* Country */}
            <Grid size={12}>
              <TextField
                fullWidth
                id="country"
                name="country"
                label="Country"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.country}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="mobile"
                name="mobile"
                label="Mobile"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.mobile}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="instagram"
                name="instagram"
                label="Instagram"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.instagram}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="twitter"
                name="twitter"
                label="Twitter"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.twitter}
              />
            </Grid>
          </Grid>

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
              CREATE RESTAURANT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;

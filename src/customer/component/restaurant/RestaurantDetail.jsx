import React, { useEffect, useState } from "react";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";



import {
  getRestaurantById,
  getRestaurantsCategory,
} from "../../state/restaurant/Action";

import { getMenuItemsByRestaurantId } from "../../state/menu/Action";
import MenuCard from "./MenuCard";


const foodTypes = [
  { label: "All", value: "all" },
  { label: "Vegetarian only", value: "vegetarian" },
  { label: "Non-Vegetarian", value: "non_vegetarian" },
  { label: "Seasonal", value: "seasonal" },
];

const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const { restaurant, menu } = useSelector((store) => store);

  const { id, city } = useParams();

  const handleFilter = (event) => {
    setFoodType(event.target.value);
  };

  const handleFilterCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    if (!id) return;

    dispatch(
      getRestaurantById({
        jwt,
        restaurantId: id,
      }),
    );

    dispatch(
      getRestaurantsCategory({
        restaurantId: id,
        jwt,
      }),
    );
  }, [dispatch, jwt, id]);

  useEffect(() => {
    if (!id) return;

    let isVegetarian = undefined;
    if (foodType === "vegetarian") isVegetarian = true;
    if (foodType === "non_vegetarian") isVegetarian = false;

    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId: id,
        vegetarian: isVegetarian,
        seasonal: foodType === "seasonal" ? true : undefined,
        foodCategory: selectedCategory || undefined,
        jwt,
      }),
    );
  }, [dispatch, jwt, id, foodType, selectedCategory]);

  const menuList = Array.isArray(menu?.menuItems)
    ? menu.menuItems
    : menu?.menuItems?.content || [];

  return (
    <div className="px-5 lg:px-20 py-5">
      <section className="py-3">
        <h3 className="text-gray-400 font-semibold py-2">
          Home / {city} / {restaurant.restaurant?.name} / {id}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <img
              className="w-full h-[40vh] object-cover"
              src={restaurant.restaurant?.images?.[0]}
              alt="Restaurant main"
            />
          </div>

          <div>
            <img
              className="w-full h-[40vh] object-cover"
              src={restaurant.restaurant?.images?.[1]}
              alt="Restaurant detail"
            />
          </div>

          <div>
            <img
              className="w-full h-[40vh] object-cover"
              src={restaurant.restaurant?.images?.[2]}
              alt="Restaurant detail"
            />
          </div>
        </div>

        {/* RESTAURANT DETAILS */}
        <div className="pt-3 pb-5">
          <h1 className="text-4xl font-semibold">
            {restaurant.restaurant?.name}
          </h1>

          <p className="text-gray-500 mt-1">
            {restaurant.restaurant?.description}
          </p>

          <div className="space-y-3 mt-3">
            <p className="text-gray-500 flex items-start gap-3">
              <LocationPinIcon />
              <span>
                <span className="block">
                  {restaurant.restaurant?.address?.streetAddress}
                </span>
                <span className="block">
                  {restaurant.restaurant?.address?.city},{" "}
                  {restaurant.restaurant?.address?.stateProvince}{" "}
                  {restaurant.restaurant?.address?.postalCode}
                </span>
                <span className="block">
                  {restaurant.restaurant?.address?.country}
                </span>
              </span>
            </p>

            <p className="text-gray-500 flex items-center gap-3">
              <CalendarMonthIcon />
              <span>{restaurant.restaurant?.openingHours}</span>
            </p>
          </div>
        </div>
      </section>

      <Divider />

      <section className="pt-8 lg:flex relative w-full">
        <div className="space-y-10 lg:w-[20%] lg:shrink-0 p-5">
          <div className="space-y-5 lg:sticky top-28 p-5 shadow-md">
            {/* FOOD TYPE FILTER */}
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                Food Type
              </Typography>

              <FormControl className="py-5 space-y-5" component="fieldset">
                <RadioGroup
                  onChange={handleFilter}
                  name="food_type"
                  value={foodType}
                >
                  {foodTypes.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            <Divider />

            {/* FOOD CATEGORY FILTER */}
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                Food Category
              </Typography>

              <FormControl className="py-5 space-y-5" component="fieldset">
                <RadioGroup
                  onChange={handleFilterCategory}
                  name="food_category"
                  value={selectedCategory}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="All Categories"
                  />
                  {restaurant?.categories?.map((item) => (
                    <FormControlLabel
                      key={item.id}
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        {/* MENU ITEMS LIST */}
        <div className="space-y-5 lg:pl-10 lg:w-[80%]">
          {menuList.length > 0 ? (
            menuList.map((item) => <MenuCard key={item.id} item={item} />)
          ) : (
            <p className="text-gray-500">No food items found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default RestaurantDetails;

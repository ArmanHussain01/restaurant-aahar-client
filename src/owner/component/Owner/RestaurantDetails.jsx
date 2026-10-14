import React from "react";
import { Grid, Card, CardHeader, CardContent, Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useDispatch, useSelector } from "react-redux";
import { updateRestaurantStatus } from "../../../customer/state/restaurant/Action";

const RestaurantDetails = () => {
  const { restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleRestaurantStatus = () => {
    dispatch(
      updateRestaurantStatus({
        restaurantId: restaurant.usersRestaurant.id,
        jwt: localStorage.getItem("jwt"),
      }),
    );
  };

  return (
    <div className="lg:px-20 px-5 pb-10">
      <div className="py-5 flex justify-center items-center gap-5">
        <h1 className="text-2xl lg:text-5xl text-center font-bold p-5 text-gray-800">
          Restaurant Detail
        </h1>

        <div>
          <Button
            variant="contained"
            onClick={handleRestaurantStatus}
            size="large"
            className="py-3 px-6"
            color={!restaurant.usersRestaurant?.open ? "error" : "primary"}
          >
            {restaurant.usersRestaurant?.open ? "CLOSE" : "OPEN"}
          </Button>
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item size={{ xs: 12 }}>
          <Card className="shadow-md rounded-lg bg-white">
            <CardHeader
              title={
                <span className="text-xl font-bold text-gray-800">
                  Restaurant
                </span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                  <p className="w-48 font-medium">Owner</p>
                  <p>
                    <span className="pr-5">-</span>{" "}
                    {restaurant.usersRestaurant?.owner.fullName}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48 font-medium">Restaurant Name</p>
                  <p>
                    <span className="pr-5">-</span>{" "}
                    {restaurant.usersRestaurant?.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48 font-medium">Cuisine Type</p>
                  <p>
                    <span className="pr-5">-</span>{" "}
                    {restaurant.usersRestaurant?.cuisineType}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48 font-medium">Opening Hours</p>
                  <p>
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.openingHours}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48 font-medium">Status</p>
                  <p className="flex items-center">
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant.open ? (
                      <span className="px-4 py-1 rounded-full bg-emerald-400 text-white font-medium text-sm">
                        Open
                      </span>
                    ) : (
                      <span className="px-4 py-1 rounded-full bg-red-500 text-white font-medium text-sm">
                        Close
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, lg: 6 }}>
          <Card className="shadow-md rounded-lg bg-white h-full">
            <CardHeader
              title={
                <span className="text-xl font-bold text-gray-800">Address</span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <div className="flex">
                  <p className="w-48 font-medium">Country</p>
                  <p>
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.country}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48 font-medium">City</p>
                  <p>
                    <span className="pr-5">-</span>{" "}
                    {restaurant.usersRestaurant?.address?.city}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48 font-medium">Postal Code</p>
                  <p>
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.postalCode}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48 font-medium">Street Address</p>
                  <p>
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.address?.streetAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, lg: 6 }}>
          <Card className="shadow-md rounded-lg bg-white h-full">
            <CardHeader
              title={
                <span className="text-xl font-bold text-gray-800">Contact</span>
              }
            />
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <div className="flex">
                  <p className="w-48 font-medium">Email</p>
                  <p>
                    <span className="pr-5">-</span>
                    {restaurant.usersRestaurant?.contactInformation?.email}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48 font-medium">Mobile</p>
                  <p>
                    <span className="pr-5">-</span> +91{" "}
                    {restaurant.usersRestaurant?.contactInformation?.mobile}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48 font-medium">Social</p>
                  <div className="flex items-center gap-3">
                    <span className="pr-5">-</span>
                    <a
                      href={
                        restaurant.usersRestaurant?.contactInformation
                          ?.instagram
                      }
                      className="text-gray-700 hover:text-blue-600"
                    >
                      <InstagramIcon fontSize="medium" />
                    </a>
                    <a
                      href={
                        restaurant.usersRestaurant?.contactInformation?.twitter
                      }
                      className="text-gray-700 hover:text-blue-400"
                    >
                      <TwitterIcon fontSize="medium" />
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-700">
                      <LinkedInIcon fontSize="medium" />
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-800">
                      <FacebookIcon fontSize="medium" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RestaurantDetails;

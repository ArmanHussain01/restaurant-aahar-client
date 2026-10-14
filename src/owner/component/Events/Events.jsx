import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import CreateEvents from "./CreateEvents";
import EventCards from "./EventCards";
import { useDispatch, useSelector } from "react-redux";

import { getRestaurantsEvents, deleteEvent } from "../../../customer/state/restaurant/Action";

const Events = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantEvents = useSelector(
    (store) => store.restaurant.restaurantsEvents,
  );

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt") || null;

  useEffect(() => {
    if (restaurantId && jwt) {
      dispatch(getRestaurantsEvents(restaurantId, jwt));
    }
  }, [dispatch, restaurantId, jwt]);

  const handleDelete = (eventId) => {
    if (eventId && jwt) {
      dispatch(deleteEvent(eventId, jwt ));
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ fontWeight: "bold", borderRadius: 2, textTransform: "none" }}
        >
          Create Event
        </Button>

        <CreateEvents open={open} handleClose={handleClose} />
      </Box>
      <div className="mt-5 px-5">
        <h1 className="text-2xl font-bold text-[#2B2825] mb-6">Events</h1>
        <div className="flex flex-wrap gap-6 justify-start items-center">
          {restaurantEvents?.map((item) => (
            <EventCards
              key={item.id || item.name}
              item={item}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Events;
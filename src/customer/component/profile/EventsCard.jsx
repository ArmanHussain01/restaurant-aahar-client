import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";


export const EventsCard = () => {

    const dispatch = useDispatch();

  const usersRestaurant = useSelector(
    (store) => store.restaurant.usersRestaurant,
  );

  const restaurantEvents = useSelector(
    (store) => store.restaurant.restaurantsEvents,
  );

  console.log("events--",restaurantEvents);
  

  const restaurantId = usersRestaurant?.id;
  const jwt = localStorage.getItem("jwt") || null;

  return (
    <Card className="w-full sm:w-[18rem] bg-white text-[#2B2825] rounded-xl shadow-md border border-[#E08A5E]/20 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
      <div className="relative">
        <CardMedia
          sx={{ height: 220 }}
          image="https://images.pexels.com/photos/28871009/pexels-photo-28871009.jpeg"
          title="Indian Fast Food"
        />
        <span className="absolute top-3 right-3 bg-[#C85A32] text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm">
          50% OFF
        </span>
      </div>

      <CardContent className="p-4 space-y-2">
        <Typography
          variant="h6"
          className="font-bold text-[#2B2825] leading-snug"
        >
          Indian Fast Food
        </Typography>
        <Typography variant="body2" className="text-[#5C5650]">
          50% off on your first order
        </Typography>

        <div className="pt-2 text-xs text-[#5C5650] space-y-1">
          <p>
            <span className="text-[#C85A32] font-semibold">Location:</span> Mumbai
          </p>
          <p>
            <span className="text-[#C85A32] font-semibold">Date:</span> Feb 15, 2026 12:00 AM
          </p>
          <p>
            <span className="text-[#C85A32] font-semibold">Ends:</span> Feb 18, 2026 12:00 AM
          </p>
        </div>
      </CardContent>

      <CardActions className="flex justify-end items-center px-4 pb-3 pt-0">
        <IconButton size="small" className="text-[#C85A32] hover:bg-[#C85A32]/10">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default EventsCard;

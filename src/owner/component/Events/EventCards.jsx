import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const EventCards = ({ item, handleDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("MMM DD, YYYY hh:mm A");
  };

  return (
    <Card className="w-full sm:w-[18rem] bg-white text-[#2B2825] rounded-xl shadow-md border border-[#E08A5E]/20 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
      <div className="relative">
        <CardMedia
          sx={{ height: 220 }}
          image={item?.image}
          title={item?.name || "Event Image"}
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
          {item?.name}
        </Typography>
        <Typography variant="body2" className="text-[#5C5650]">
          {item?.description}
        </Typography>

        <div className="pt-2 text-xs text-[#5C5650] space-y-1">
          <p>
            <span className="text-[#C85A32] font-semibold">Location:</span>{" "}
            {item?.location}
          </p>
          <p>
            <span className="text-[#C85A32] font-semibold">Start Time:</span>{" "}
            {formatDate(item?.startDateTime)}
          </p>
          <p>
            <span className="text-[#C85A32] font-semibold">End Time:</span>{" "}
            {formatDate(item?.endDateTime)}
          </p>
        </div>
      </CardContent>

      <CardActions className="flex justify-end items-center px-4 pb-3 pt-0">
        <IconButton
          onClick={() => handleDelete(item?.id)}
          size="small"
          className="text-[#C85A32] hover:bg-[#C85A32]/10"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default EventCards;
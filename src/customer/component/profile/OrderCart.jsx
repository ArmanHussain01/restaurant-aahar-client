import { Button, Card } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const OrderCard = ({ item, order, showTrack = false }) => {
  return (
    <Card className="flex justify-between items-center p-4 bg-white text-[#2B2825] rounded-lg shadow-sm border border-[#E08A5E]/20">
      <div className="flex items-center space-x-4">
        <img
          className="h-16 w-16 object-cover rounded-md border border-[#E08A5E]/30"
          src={item.food.images[0]}
          alt={item.food.name}
        />
        <div>
          <p className="font-semibold text-lg text-[#2B2825]">
            {item.food.name}
          </p>
          <p className="text-[#C85A32] font-semibold">₹{item.totalPrice}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Button
          disabled
          variant="contained"
          size="small"
          className="bg-[#E08A5E]/15 text-[#C85A32] border border-[#C85A32]/30 cursor-not-allowed capitalize font-semibold px-4 py-1.5 rounded-full"
          sx={{
            "&.Mui-disabled": {
              backgroundColor: "rgba(224, 138, 94, 0.15)",
              color: "#C85A32",
              borderColor: "rgba(200, 90, 50, 0.3)",
            },
          }}
        >
          {order.orderStatus}
        </Button>

        {showTrack && (
          <Button
            component={Link}
            to={`/track-order/${order.id}`}
            size="small"
            variant="outlined"
            sx={{
              color: "#C85A32",
              borderColor: "#C85A32",
              borderRadius: "9999px",
              textTransform: "capitalize",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#C85A32",
                backgroundColor: "rgba(224, 138, 94, 0.1)",
              },
            }}
          >
            Track order
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;

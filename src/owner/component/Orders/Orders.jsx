import React, { useState } from "react";
import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import OrderTable from "./OrderTable";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "All", value: "ALL" },
];

const Orders = () => {
  const [filterValue, setFilterValue] = useState("ALL");

  const handleFilter = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <div className="px-2">
      <Card className="p-5">
        <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
          Order Status
        </Typography>
        <FormControl>
          <RadioGroup
            onChange={handleFilter}
            row
            name="category"
            value={filterValue}
          >
            {orderStatus.map((item) => (
              <FormControlLabel
                key={item.label}
                value={item.value}
                control={<Radio />}
                label={item.label}
                sx={{ color: "gray" }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Card>

      <OrderTable filterValue={filterValue} />
    </div>
  );
};

export default Orders;
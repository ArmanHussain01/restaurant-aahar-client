import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Card } from "@mui/material";
const AddressCart = ({
  item,
  showButton,
  handleSelectAddress,
}) => {

  return (
    <Card className="flex gap-5 w-64 p-5">

      <HomeIcon />

      <div className="space-y-3 text-gray-500">

        <h1 className="font-semibold text-lg text-[#2B2825]">
          Home
        </h1>

        <p>
          {item.streetAddress}, {item.city},{" "}
          {item.stateProvince && `${item.stateProvince}, `}
          {item.postalCode}, {item.country}
        </p>

        {showButton && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleSelectAddress(item)}
          >
            SELECT
          </Button>
        )}

      </div>

    </Card>
  );
};

export default AddressCart;
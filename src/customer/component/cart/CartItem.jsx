import React from "react";
import { IconButton, Chip } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCartItem, updateCartItem } from "../../state/cart/Action";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, cart } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const handleRemoveCartItem = () => {
    dispatch(
      removeCartItem({
        cartItemId: item.id,
        jwt: auth.jwt || jwt,
      }),
    );
  };

  const handleUpdateCartItem = (value) => {
    if (value === -1 && item.quantity === 1) {
      return handleRemoveCartItem();
    }

    const data = {
      cartItemId: item.id,
      quantity: item.quantity + value,
    };

    dispatch(
      updateCartItem({
        data,
        jwt: auth.jwt || jwt,
      }),
    );
  };

  return (
    <div className="px-5">
      <div className="flex items-center gap-5">
        <img
          className="w-[5rem] h-[5rem] object-cover rounded"
          src={
            item.food?.images?.[0] ||
            "https://images.pexels.com/photos/34425639/pexels-photo-34425639.jpeg"
          }
          alt={item.food?.name || "food item"}
        />

        <div className="flex items-center justify-between w-full">
          <div className="space-y-1 lg:space-y-3">
            <p className="font-medium">{item.food?.name}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <IconButton
                  onClick={() => handleUpdateCartItem(-1)}
                  size="small"
                >
                  <RemoveCircleIcon />
                </IconButton>
                <div className="w-5 h-5 text-xs flex items-center justify-center">
                  {item.quantity}
                </div>
                <IconButton
                  onClick={() => handleUpdateCartItem(1)}
                  size="small"
                >
                  <AddCircleOutlineOutlinedIcon />
                </IconButton>
              </div>
            </div>
          </div>

          <p className="font-semibold">₹{item.totalPrice}</p>
        </div>
      </div>

      {/* Render Selected Ingredients dynamically */}
      <div className="pt-3 flex flex-wrap gap-2">
        {item.ingredients?.map((ingredient, index) =>
          ingredient ? (
            <Chip key={index} label={ingredient} size="small" />
          ) : null,
        )}
      </div>
    </div>
  );
};

export default CartItem;

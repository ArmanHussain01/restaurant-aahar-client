import React from "react";
import RestaurantCart from "../Restaurant/RestaurantCart";
import { useSelector } from "react-redux";

const Favorites = () => {
  const { auth } = useSelector((store) => store);

  return (
    <div>
      <h1 className="py-5 text-xl font-semibold text-center">
        My Favorites
      </h1>

      <div className="flex flex-wrap gap-3 justify-center">
        {auth.favorites.map((item) => (
          <RestaurantCart
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
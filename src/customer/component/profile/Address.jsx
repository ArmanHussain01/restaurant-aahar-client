import React, { useEffect } from "react";
import AddressCard from "../cart/AddressCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../auth/state/authentication/Action";

const Address = () => {
  const { auth } = useSelector((store) => store);

  const addresses = auth.user?.addresses || [];

  const handleSelectAddress = (selectedAddress) => {
    console.log("Selected Address:", selectedAddress);

    // You can use this later when creating the order
    // navigate("/checkout");
  };

  return (
    <div className="px-5 mt-5">
      <h1 className="text-2xl font-bold text-[#2B2825] mb-6">
        Saved Addresses
      </h1>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No saved addresses found.</p>
      ) : (
        <div className="flex flex-wrap gap-6 items-stretch">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              item={address}
              showButton={true}
              handleSelectAddress={handleSelectAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Address;

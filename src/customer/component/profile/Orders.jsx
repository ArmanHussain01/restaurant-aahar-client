import React, { useEffect } from "react";
import OrderCart from "./OrderCart";
import { useDispatch, useSelector } from "react-redux";
import { getUsersOrders } from "../../state/order/Action";

const Orders = () => {
  const orders = useSelector((store) => store.order.orders);

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();

  useEffect(() => {
    if (jwt) {
      dispatch(getUsersOrders(jwt));
    }
  }, [dispatch, jwt]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-xl text-center py-7 font-semibold">My Orders</h1>

      <div className="space-y-5 w-full lg:w-1/2">
        {orders?.map((o) =>
          o.items?.map((item, index) => (
            <OrderCart
              key={item.id}
              item={item}
              order={o}
              showTrack={index === 0}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Orders;

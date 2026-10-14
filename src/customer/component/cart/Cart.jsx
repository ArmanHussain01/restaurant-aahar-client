import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddressCart from "./AddressCart";
import CartItem from "./CartItem";
import { createOrder } from "../../state/order/Action";
import { clearCartItem } from "../../state/cart/Action";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const initialValues = { streetAddress: "", state: "", pincode: "", city: "" };

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string().required("Pincode is required"),
  city: Yup.string().required("City is required"),
});

const FormikTextField = ({ name, label, xs = 12 }) => (
  <Grid item xs={xs}>
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          variant="outlined"
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error ? meta.error : ""}
        />
      )}
    </Field>
  </Grid>
);

const Cart = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { auth, cart } = useSelector((store) => store);

  const FEES = { delivery: 20, platform: 5, gst: 45 };
  const items = cart.cartItems || [];
  const addresses = auth.user?.addresses || [];
  const cartTotal = cart.cart?.total ?? 0;
  const grandTotal = cartTotal + FEES.delivery + FEES.platform + FEES.gst;

  const placeOrder = (payload) => {
    const restaurantId = items[0]?.food?.restaurantId;
    if (!restaurantId) return console.error("Restaurant ID not found");

    const jwt = localStorage.getItem("jwt");

    dispatch(
      createOrder({
        jwt,
        orderData: {
          restaurantId,
          ...(payload.addressId && { addressId: payload.addressId }),
          ...(payload.address && { deliveryAddress: payload.address }),
        },
      }),
    );

    dispatch(clearCartItem());
  };
  const handleSubmit = (
    values,
    { resetForm, setFieldError, setFieldTouched },
  ) => {
    const normalize = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase();

    const isDuplicate = addresses.some((addr) => {
      const matchStreet =
        normalize(addr.streetAddress) === normalize(values.streetAddress);
      const matchCity = normalize(addr.city) === normalize(values.city);
      const matchState =
        normalize(addr.stateProvince) === normalize(values.state);
      const matchPincode =
        normalize(addr.postalCode) === normalize(values.pincode);

      return matchStreet && matchCity && matchState && matchPincode;
    });

    if (isDuplicate) {
      setFieldError(
        "streetAddress",
        "This address already exists. Please select it from your saved addresses.",
      );
      setFieldTouched("streetAddress", true, false);
      return;
    }

    const newAddress = {
      streetAddress: values.streetAddress.trim(),
      city: values.city.trim(),
      stateProvince: values.state.trim(),
      postalCode: values.pincode.trim(),
      country: "India",
    };

    placeOrder({ address: newAddress });
    resetForm();
    setOpen(false);
  };

  return (
    <div>
      <main className="lg:flex justify-between">
        {/* Cart Items & Bill Details */}
        <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
          <div className="space-y-6">
            {items.length > 0 ? (
              items.map((item) => <CartItem key={item.id} item={item} />)
            ) : (
              <p className="px-5 text-gray-500">Your cart is empty.</p>
            )}
          </div>

          <Divider />

          {cart.loading ? (
            <p className="px-5">Loading cart...</p>
          ) : (
            <div className="billDetails px-5 text-sm space-y-3">
              <p className="font-extralight py-2 text-base">Bill Details</p>

              {[
                { label: "Item Total", value: cartTotal },
                { label: "Delivery Fee", value: FEES.delivery },
                { label: "Platform fee", value: FEES.platform },
                { label: "GST and Restaurant Charges", value: FEES.gst },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-gray-400">
                  <p>{label}</p>
                  <p>₹{value}</p>
                </div>
              ))}

              <Divider />

              <div className="flex justify-between font-semibold">
                <p>Total Pay</p>
                <div className="flex items-center gap-2">
                  <p>₹{grandTotal}</p>
                  {cart.updating && (
                    <span className="text-xs text-gray-400">Updating...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <Divider orientation="vertical" flexItem />

        {/* Address Selector Section */}
        <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
          <div>
            <h1 className="text-center font-semibold text-2xl py-10">
              Choose Delivery Address
            </h1>

            <div className="flex gap-5 flex-wrap justify-center">
              {addresses.map((addr) => (
                <AddressCart
                  key={addr.id}
                  item={addr}
                  handleSelectAddress={(selected) =>
                    placeOrder({ addressId: selected.id })
                  }
                  showButton
                />
              ))}

              <Card className="flex gap-5 w-64 p-5">
                <AddLocationAltIcon />
                <div className="space-y-3 text-gray-500">
                  <h1 className="font-semibold text-lg text-white">
                    Add New Address
                  </h1>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpen(true)}
                  >
                    Add
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Address Form Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <FormikTextField name="streetAddress" label="Street Address" />
                <FormikTextField name="state" label="State" xs={6} />
                <FormikTextField name="city" label="City" xs={6} />
                <FormikTextField name="pincode" label="Pincode" />

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Deliver Here
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default Cart;

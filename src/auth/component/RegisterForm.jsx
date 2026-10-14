import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from "../state/authentication/Action";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "ROLE_CUSTOMER", 
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[^\d\W]/, "Name must not start with a number or symbol")
    .matches(/^[a-zA-Z\s]+$/, "Symbols and special characters are not allowed"),

  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format. Must end with a valid domain (e.g., example@gmail.com)"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    ),

  role: Yup.string().required("Role is required"),
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    dispatch(registerUser({ userData: values, navigate }));
  };

  return (
    <div>
      <Typography variant="h5" className="text-center">
        Register
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="fullName"
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={
                <ErrorMessage
                  name="fullName"
                  component="span"
                  className="text-red-500 text-xs"
                />
              }
            />

            <Field
              as={TextField}
              name="email" 
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-500 text-xs"
                />
              }
            />

            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-500 text-xs"
                />
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Field
                as={Select}
                name="role"
                labelId="role-select-label"
                id="role-select"
                label="Role"
              >
                <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
                <MenuItem value={"ROLE_RESTAURANT_OWNER"}>Restaurant Owner</MenuItem>
                <MenuItem value={"ROLE_DELIVERY_PARTNER"}>Delivery Partner</MenuItem>
              </Field>
            </FormControl>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, padding: "0.8rem" }}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Already have an account?
        <Button size="small" onClick={() => navigate("/account/login")}>
          Login
        </Button>
      </Typography>
    </div>
  );
};

export default RegisterForm;
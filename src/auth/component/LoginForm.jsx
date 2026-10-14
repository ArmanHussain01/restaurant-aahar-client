import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../state/authentication/Action";
const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format (e.g., example@gmail.com)"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    ),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const handleSubmit = (values) => {
    dispatch(loginUser({ userData: values, navigate }));
  };

  return (
    <div>
      <Typography variant="h5" className="text-center font-semibold mb-2">
        Login
      </Typography>

      {auth.error && (
        <Alert severity="error" className="mb-4">
          {typeof auth.error === "string"
            ? auth.error
            : auth.error?.message || "Invalid email or password. Please try again."}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
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

            <Box display="flex" justifyContent="flex-end">
              <Button
                size="small"
                onClick={() => navigate("/account/forgot-password")}
                sx={{ textTransform: "none" }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, padding: "0.8rem" }}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don't have an account?
        <Button size="small" onClick={() => navigate("/account/register")}>
          Register
        </Button>
      </Typography>
    </div>
  );
};

export default LoginForm;
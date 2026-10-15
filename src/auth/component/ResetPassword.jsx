import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword, resetAuthState } from "../state/resetOtp/Action";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("New password is required")
    .min(6, "Password must contain at least 6 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reset } = useSelector((store) => store);

  const handleSubmit = (values) => {
    const email = localStorage.getItem("reset_email");
    const otp = localStorage.getItem("reset_otp");

    const request = {
      email,
      otp,
      newPassword: values.password,
    };

    console.log("REQUEST PAYLOAD:", request);

    dispatch(resetPassword(request));
  };

  useEffect(() => {
    if (reset.passwordReset) {
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_otp");
      navigate("/account/login", { replace: true });
    }
  }, [reset.passwordReset, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  return (
    <Container
      maxWidth="xs"
      className="min-h-screen flex flex-col justify-center py-12"
    >
      <Paper elevation={3} className="p-6 rounded-lg">
        <Typography variant="h5" className="text-center font-semibold mb-2">
          Reset Password
        </Typography>

        <Typography variant="body2" className="text-center text-gray-600 mb-4">
          Enter your new password below.
        </Typography>

        {reset.error && (
          <Alert severity="error" className="mb-4">
            {typeof reset.error === "string"
              ? reset.error
              : "Failed to reset password. Try again."}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-2">
              <Field
                as={TextField}
                name="password"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                size="small"
                error={touched.password && Boolean(errors.password)}
                helperText={
                  <ErrorMessage
                    name="password"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                }
              />

              <Field
                as={TextField}
                name="confirmPassword"
                label="Re-enter New Password"
                type="password"
                fullWidth
                variant="outlined"
                size="small"
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={
                  <ErrorMessage
                    name="confirmPassword"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                }
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={reset.loading}
                sx={{ mt: 2, padding: "0.6rem" }}
              >
                {reset.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ResetPassword;

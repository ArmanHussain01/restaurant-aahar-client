import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, Alert, CircularProgress, Container, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgetPassword, resetAuthState } from "../State/resetOtp/Action";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reset } = useSelector((store) => store);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (reset.otpSent) {
      navigate("/account/verify-otp");
    }
  }, [reset.otpSent, navigate]);

  const handleSubmit = (values) => {
    localStorage.setItem("reset_email", values.email);
    dispatch(forgetPassword(values.email));
  };

  return (
    <Container maxWidth="xs" className="min-h-screen flex flex-col justify-center py-12">
      <Paper elevation={3} className="p-6 rounded-lg">
        <Typography variant="h5" className="font-semibold text-center mb-4">
          Forgot Password
        </Typography>

        {reset.error && (
          <Alert severity="error" className="mb-4">
            {typeof reset.error === "string" ? reset.error : "Failed to send OTP"}
          </Alert>
        )}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <Field
                as={TextField}
                name="email"
                label="Email Address"
                fullWidth
                variant="outlined"
                size="small"
                error={touched.email && Boolean(errors.email)}
                helperText={<ErrorMessage name="email" component="span" className="text-red-500 text-xs" />}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={reset.loading}
                sx={{ padding: "0.6rem" }}
              >
                {reset.loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
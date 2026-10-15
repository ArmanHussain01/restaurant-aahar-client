import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp, forgetPassword, resetAuthState } from "../state/resetOtp/Action";

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{4,6}$/, "OTP must be 4 to 6 digits"),
});

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reset } = useSelector((store) => store);

  const email = localStorage.getItem("reset_email");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Navigate to Reset Password only on success
  useEffect(() => {
    if (reset.otpVerified) {
      navigate("/account/reset-password");
    }
  }, [reset.otpVerified, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

const handleSubmit = (values) => {
  localStorage.setItem("reset_otp", values.otp);
  dispatch(verifyOtp({ email, otp: values.otp }));
};

  const handleResendOtp = () => {
    if (email) {
      dispatch(forgetPassword(email));
      setTimeLeft(300);
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem("reset_email");
    dispatch(resetAuthState());
    navigate("/account/forgot-password", { replace: true });
  };

  return (
    <Container maxWidth="xs" className="min-h-screen flex flex-col justify-center py-12">
      <Box className="flex flex-col items-center mb-6">
        <Typography variant="h5" component="h1" className="font-semibold text-center mb-2">
          Verify OTP
        </Typography>
        <Typography variant="body2" className="text-center text-gray-600 px-2">
          Enter the verification code sent to <strong>{email || "your email"}</strong>.
        </Typography>
      </Box>

      {reset.error && (
        <Alert severity="error" className="mb-4">
          {typeof reset.error === "string" ? reset.error : "Invalid OTP. Please try again."}
        </Alert>
      )}

      <Paper elevation={3} className="p-6 rounded-lg">
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-2">
              <Typography variant="caption" className="font-medium text-gray-700">
                Enter verification OTP
              </Typography>

              <Field
                as={TextField}
                name="otp"
                placeholder="123456"
                fullWidth
                variant="outlined"
                size="small"
                slotProps={{
                  htmlInput: { maxLength: 6 },
                }}
                error={touched.otp && Boolean(errors.otp)}
                helperText={
                  <ErrorMessage
                    name="otp"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                }
              />

              <Box className="flex justify-between items-center my-1">
                <Typography variant="caption" color={timeLeft === 0 ? "error" : "textSecondary"}>
                  {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : "OTP Expired"}
                </Typography>

                <Button
                  size="small"
                  disabled={timeLeft > 0 || reset.loading}
                  onClick={handleResendOtp}
                  sx={{ textTransform: "none", fontSize: "0.75rem", p: 0, minWidth: "auto" }}
                >
                  Resend OTP
                </Button>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={reset.loading || timeLeft === 0}
                sx={{ mt: 2, padding: "0.6rem" }}
              >
                {reset.loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Box className="mt-6 text-center">
        <Typography variant="body2" color="textSecondary">
          Entered the wrong email?{" "}
          <Button
            size="small"
            onClick={handleChangeEmail}
            sx={{ textTransform: "none", p: 0, minWidth: "auto", fontWeight: 600 }}
          >
            Change Email
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default VerifyOtp;
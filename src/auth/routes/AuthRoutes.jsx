import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../customer/component/home/Home";
import ForgotPassword from "../component/ForgotPassword";
import VerifyOtp from "../component/VerifyOtp";
import ResetPassword from "../component/ResetPassword";




const ResetEmailGuard = ({ children }) => {
  const email = localStorage.getItem("reset_email");
  return email ? children : <Navigate to="/account/forgot-password" replace />;
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Home />} />
      <Route path="register" element={<Home />} />

      <Route path="forgot-password" element={<ForgotPassword />} />

      <Route
        path="verify-otp"
        element={
          <ResetEmailGuard>
            <VerifyOtp />
          </ResetEmailGuard>
        }
      />

      <Route
        path="reset-password"
        element={
          <ResetEmailGuard>
            <ResetPassword />
          </ResetEmailGuard>
        }
      />
    </Routes>
  );
};

export default AuthRoutes;
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "../../auth/state/authentication/Action"; 

export const DELIVERY_ROLE = "ROLE_DELIVERY_PARTNER";

const DeliveryRoleGuard = ({ children }) => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((store) => store.auth);
  const token = localStorage.getItem("jwt"); 
  const requested = useRef(false);

  useEffect(() => {
    if (token && !user && !requested.current) {
      requested.current = true;
      dispatch(getUser(token));
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="/account/login" replace />;
  }


  if (!user && !error) {
    return <div>Loading delivery portal...</div>;
  }

  // If there's an error fetching the user or role doesn't match, redirect
  if (error || user?.role !== DELIVERY_ROLE) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DeliveryRoleGuard;
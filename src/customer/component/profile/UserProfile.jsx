import React, { useEffect } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../../auth/state/authentication/Action';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth } = useSelector((store) => store);

  const user = auth.user;

  const handleLogOut = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">

      <div className="flex flex-col items-center justify-center">

        <AccountCircleIcon sx={{ fontSize: "9rem" }} />

        <h1 className="py-5 text-2xl font-semibold">
          {user?.fullName || "User"}
        </h1>

        <p>
          Email: {user?.email || "No email"}
        </p>

        <Button
          onClick={handleLogOut}
          sx={{ margin: "2rem 0rem" }}
        >
          Logout
        </Button>

      </div>

    </div>
  );
};

export default UserProfile
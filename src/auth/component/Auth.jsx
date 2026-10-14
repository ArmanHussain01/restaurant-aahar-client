import React from 'react';
import { Box, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm'

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnClose = () => {
    navigate("/");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#18181b",
    color: "#fff",
    outline: "none",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    border: "1px solid #27272a"
  };

  return (
    <Modal
      open={
        location.pathname === "/account/register" ||
        location.pathname === "/account/login"
      }
      onClose={handleOnClose}
    >
      <Box sx={style}>
        {location.pathname === "/account/register" ? <RegisterForm/>: <LoginForm/>}
      </Box>
    </Modal>
  );
};

export default Auth;
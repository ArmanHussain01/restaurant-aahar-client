import React, { useState } from "react";
import ProfileNavigation from "./ProfileNavigation";

import { Route, Router, Routes } from "react-router-dom";

import Orders from "./Orders";
import Address from "./Address";
import Favorites from "./Favorites";
import Events from "./Events";
import { MobileBottomNav } from "../navbar/MobileBottomNav";
import UserProfile from "./UserProfile";

const Profile = () => {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <div className="lg:flex justify-between min-h-[calc(100vh-65px)] bg-[#F9F6F0] text-[#2B2825] relative">
      <div className="hidden lg:block lg:w-[20vw] sticky top-16.25 h-[calc(100vh-65px)] bg-white border-r border-[#E08A5E]/20 shadow-sm">
        <ProfileNavigation
          open={openSideBar}
          handleClose={() => setOpenSideBar(false)}
        />
      </div>

      <div className="w-full lg:w-[80vw] p-4 lg:p-8 pb-20 lg:pb-8 bg-[#F9F6F0]">
        <Routes>
          <Route path="/" element={<UserProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<Address />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Profile;

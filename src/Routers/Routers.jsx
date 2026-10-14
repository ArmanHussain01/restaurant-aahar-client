import React from "react";
import { Route, Routes } from "react-router-dom";

import CustomserRoute from "../customer/routes/CustomerRoute";
import OwnerRoute from "../owner/Routes/OwnerRoute";
import DeliveryRoute from "../delivery/routes/DeliveryRoute";
import DeliveryRoleGuard from "../delivery/routes/DeliveryRoleGuard";

const Routers = () => {
  return (
    <Routes>
      
      <Route path="/owner/restaurants/*" element={<OwnerRoute />} />

  
      <Route
        path="/delivery/*"
        element={
          <DeliveryRoleGuard>
            <DeliveryRoute />
          </DeliveryRoleGuard>
        }
      />

      <Route path="/*" element={<CustomserRoute />} />
    </Routes>
  );
};

export default Routers;
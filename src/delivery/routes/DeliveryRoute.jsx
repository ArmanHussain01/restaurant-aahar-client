import { Navigate, Route, Routes } from "react-router-dom";
import DeliveryPartnerDashboard from "../component/DeliveryPartnerDashboard";
import DeliveryOverview from "../component/DeliveryOverview";
import AssignedDeliveries from "../component/AssignedDeliveries";
import ActiveDeliveries from "../component/ActiveDeliveries";
import DeliveryHistory from "../component/DeliveryHistory";
import DeliveryDetails from "../component/DeliveryDetails";
 
export default function DeliveryRoute() {
  return (
    <Routes>
      <Route element={<DeliveryPartnerDashboard />}>
        <Route index element={<DeliveryOverview />} />
        <Route path="assigned" element={<AssignedDeliveries />} />
        <Route path="active" element={<ActiveDeliveries />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path=":deliveryId" element={<DeliveryDetails />} />
        <Route path="*" element={<Navigate to="/delivery" replace />} />
      </Route>
    </Routes>
  );
}

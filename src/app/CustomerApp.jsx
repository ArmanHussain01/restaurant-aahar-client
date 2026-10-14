import { BrowserRouter } from "react-router-dom";
import CustomerRoute from "../customer/routes/CustomerRoute";

const CustomerApp = () => {
  return (
    <BrowserRouter>
      <CustomerRoute />
    </BrowserRouter>
  );
};

export default CustomerApp;
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import DeliveryList from "./DeliveryList";
import { selectAssigned } from "../state/delivery/selectors";

export default function AssignedDeliveries({ showTitle = true }) {
  const deliveries = useSelector(selectAssigned);
  return (
    <>
      {showTitle && <Typography variant="h6" gutterBottom>Assigned deliveries</Typography>}
      <DeliveryList deliveries={deliveries} emptyTitle="No deliveries assigned" emptyHint="New assignments appear here automatically." />
    </>
  );
}

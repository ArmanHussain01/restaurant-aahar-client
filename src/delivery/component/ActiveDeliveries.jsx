import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import DeliveryList from "./DeliveryList";
import { selectActive } from "../state/delivery/selectors";

export default function ActiveDeliveries() {
  const deliveries = useSelector(selectActive);
  return (
    <>
      <Typography variant="h6" gutterBottom>Active deliveries</Typography>
      <DeliveryList deliveries={deliveries} emptyTitle="No active deliveries" emptyHint="Accept an assigned delivery to start." />
    </>
  );
}

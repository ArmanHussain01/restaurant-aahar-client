import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import DeliveryList from "./DeliveryList";
import { selectHistory } from "../state/delivery/selectors";

export default function DeliveryHistory() {
  const deliveries = useSelector(selectHistory);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Delivery history
      </Typography>
      <DeliveryList
        deliveries={deliveries}
        emptyTitle="No completed deliveries yet"
        emptyHint="Delivered orders are listed here."
      />
    </>
  );
}

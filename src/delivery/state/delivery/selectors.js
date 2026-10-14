import { DELIVERY_STATUS as S, isActiveStatus } from "../../../shared/util/deliveryStatus";

export const selectDeliveryState = (s) => s.delivery;
export const selectDeliveries = (s) => s.delivery.deliveries;
export const selectAssigned = (s) => s.delivery.deliveries.filter((d) => d.status === S.ASSIGNED);
export const selectActive = (s) => s.delivery.deliveries.filter((d) => isActiveStatus(d.status));
export const selectHistory = (s) => s.delivery.deliveries.filter((d) => d.status === S.DELIVERED);
export const selectDeliveryById = (s, id) => s.delivery.deliveries.find((d) => String(d.id) === String(id));
export const selectInFlight = (s, id) => Boolean(s.delivery.inFlight[id]);
export const selectActionError = (s, id) => s.delivery.actionError[id] ?? null;

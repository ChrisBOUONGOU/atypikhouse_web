import apiPlatformClient from "./api/apiPlatformClient";
import { URI_RESERVATION } from "./api/constants";

export async function getReservationsByOwner(ownerId) {
  let uri = `${URI_RESERVATION}?offer.owner.id=${ownerId}`;
  const reservations = await apiPlatformClient.get(uri);
  if (reservations) {
    return reservations;
  }
  return null;
}

import apiPlatformClient from "./api/apiPlatformClient";
import { URI_EQUIPMENTS } from "./api/constants";

export async function getEquipments() {
  const equipments = await apiPlatformClient.get(
    `${URI_EQUIPMENTS}?pagination=false`
  );
  return equipments;
}

export async function getEquipmentsFor(offerId) {
  if (offerId) {
    const equipments = await apiPlatformClient.get(
      `${URI_EQUIPMENTS}?pagination=false&offers.id=${offerId}`
    );
    return equipments;
  }
  return null;
}

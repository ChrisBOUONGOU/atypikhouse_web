import apiPlatformClient from "./api/apiPlatformClient";
import { URI_DYNAMIC_PROPERTIES_VALUE } from "./api/constants";

export async function getDynamicPropertValuesFor(offerId) {
  if (offerId) {
    const dynamicPropertyValues = await apiPlatformClient.get(
      `${URI_DYNAMIC_PROPERTIES_VALUE}?pagination=false&offer.id=${offerId}`
    );

    if (
      dynamicPropertyValues &&
      Array.isArray(dynamicPropertyValues) &&
      dynamicPropertyValues.length
    ) {
      return dynamicPropertyValues.map((elem) => {
        const dpv = castDPV(elem.dynamicProperty.type, elem.value);
        return {
          id: elem.id,
          offer: elem.offer,
          dynamicProperty: "/api/dynamic_properties/" + elem.dynamicProperty.id,
          value: dpv,
        };
      });
    }
  }
  return null;
}

function castDPV(dpType, value) {
  if ("BINARY" === dpType) {
    return value === "true";
  }
  return value;
}

import apiPlatformClient from "./api/apiPlatformClient";
import { URI_DYNAMIC_PROPERTIES } from "./api/constants";

export async function getDynamicPropertiesByCategory(cid) {
  let uri = `${URI_DYNAMIC_PROPERTIES}?offerType=${cid}&pagination=false`;
  const dynamicProperties = await apiPlatformClient.get(uri);
  return dynamicProperties;
}



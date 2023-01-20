import apiPlatformClient from "./api/apiPlatformClient";
import { URI_FAVORITES_BY_ID } from "./api/constants";

export async function getFavoritesByUserId(userId) {
  let uri = `${URI_FAVORITES_BY_ID}?user=/api/users/${userId}`;
  return await apiPlatformClient.get(uri);
}

import apiPlatformClient from "./api/apiPlatformClient";
import { URI_SOCIAL_MEDIAS } from "./api/constants";

export async function getSocialMedias() {
  let uri = URI_SOCIAL_MEDIAS;
  const socialMedias = await apiPlatformClient.get(uri);
  return socialMedias;
}

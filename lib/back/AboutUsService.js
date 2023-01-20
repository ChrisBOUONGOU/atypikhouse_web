import apiPlatformClient from "./api/apiPlatformClient";
import { URI_ABOUT_US } from "./api/constants";

export async function getAboutUsContent() {
  const aboutUs = await apiPlatformClient.get(URI_ABOUT_US);
  if (
    Array.isArray(aboutUs) &&
    aboutUs.length > 0 &&
    aboutUs[0].content != ""
  ) {
    return aboutUs[0].content;
  }
  return "Contenu indisponible actuellement";
}

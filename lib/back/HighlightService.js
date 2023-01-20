import apiPlatformClient from "./api/apiPlatformClient";
import { URI_HIGHLIGHTS } from "./api/constants";

export async function deleteHighlightById(highlightId) {
  const uri = `${URI_HIGHLIGHTS}/${highlightId}`;
  const response = await apiPlatformClient.delete(uri);
  if (response && response.ok) {
    return true;
  }
  return false;
}

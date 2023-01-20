import apiPlatformClient from "./api/apiPlatformClient";
import { URI_MEDIAS } from "./api/constants";

export async function createMedias(mediasData) {
  if (!mediasData || !Array.isArray(mediasData) || !mediasData.length) {
    return null;
  }

  let createdMedias = [];
  for (const mediaData of mediasData) {
    let result = await createMedia(mediaData);
    if (result && result.id) {
      createdMedias.push(result);
    }
  }
  return createdMedias;
}

export async function createMedia(mediaData) {
  const createdMedias = await apiPlatformClient.post(URI_MEDIAS, {
    payload: mediaData,
  });
  return createdMedias;
}

export async function getMediaById(mediaId) {
  const uri = `${URI_MEDIAS}/${mediaId}`;
  const media = await apiPlatformClient.get(uri);
  if (media && media.id) {
    return media;
  }
  return null;
}

export async function deleteMediaById(mediaId) {
  const uri = `${URI_MEDIAS}/${mediaId}`;
  const response = await apiPlatformClient.delete(uri);
  if (response && response.ok) {
    return true;
  }
  return false;
}

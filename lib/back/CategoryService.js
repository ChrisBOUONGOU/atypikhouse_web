import apiPlatformClient from "./api/apiPlatformClient";
import {
  URI_CATEGORIES,
  URI_CATEGORY,
  URI_CATEGORY_TRENDING,
} from "./api/constants";

export async function getTrending() {
  const trendingCollections = await apiPlatformClient.get(
    URI_CATEGORY_TRENDING
  );
  return trendingCollections;
}

export async function getCategories() {
  const categories = await apiPlatformClient.get(URI_CATEGORIES);
  return categories;
}

export async function getAllCategories() {
  const categories = await apiPlatformClient.get(
    `${URI_CATEGORIES}?pagination=false`
  );
  return categories;
}

export async function getCategory(cid) {
  let uri = `${URI_CATEGORY}${cid}`;
  const category = await apiPlatformClient.get(uri);
  return category;
}

export async function getCategoryForOffer(offer) {
  if (offer && offer.offerType) {
    return await apiPlatformClient.get(offer.offerType);
  }
  return null;
}

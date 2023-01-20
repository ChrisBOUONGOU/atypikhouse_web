import apiPlatformClient from "./api/apiPlatformClient";
import {
  URI_ADDRESS_BY_ID,
  URI_CITIES_BY_REGION,
  URI_REGIONS_BY_COUNTRY,
} from "./api/constants";

export async function getAddressById(addressId) {
  if (addressId) {
    let uri = `${URI_ADDRESS_BY_ID}${addressId}`;
    const address = await apiPlatformClient.get(uri);
    return address;
  }
  return {};
}

export async function getCountryRegions(country) {
  if (country) {
    let uri = `${URI_REGIONS_BY_COUNTRY}${country}&pagination=false`;
    const regions = await apiPlatformClient.get(uri);
    return regions;
  }
  return null;
}

export async function getCitiesByRegion(regionId) {
  if (regionId) {
    const result = await apiPlatformClient.get(
      `${URI_CITIES_BY_REGION}${regionId}&pagination=false`
    );
    return result;
  }

  return null;
}

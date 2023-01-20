import apiPlatformClient from "./api/apiPlatformClient";
import {
  URI_OFFERS,
  URI_OFFERS_OF_CATEGORY,
  URI_OFFER_BY_ID,
} from "./api/constants";

export async function createOffer(offerData) {
  const createdOffer = await apiPlatformClient.post(URI_OFFERS, {
    payload: offerData,
  });
  return createdOffer;
}

export async function updateOffer(id, offerData) {
  const uri = `${URI_OFFERS}/${id}`;
  const updatedOffer = await apiPlatformClient.put(uri, {
    payload: offerData,
  });
  return updatedOffer;
}

export async function getOffers(pageNumber = 1) {
  const offers = await apiPlatformClient.get(
    `${URI_OFFERS}?page=${pageNumber}&status=published`,
    {
      accept: "application/ld+json",
    }
  );
  let offersData = {
    offers: offers["hydra:member"],
    totalItems: offers["hydra:totalItems"],
  };
  return offersData;
}

export async function getCategoryOffers(cid, pageNumber = 1) {
  let uri = `${URI_OFFERS_OF_CATEGORY}${cid}&page=${pageNumber}&status=published`;
  const offers = await apiPlatformClient.get(uri, {
    accept: "application/ld+json",
  });
  let offersData = {
    offers: offers["hydra:member"],
    totalItems: offers["hydra:totalItems"],
  };
  return offersData;
}

export async function getOfferById(offerId) {
  let uri = `${URI_OFFER_BY_ID}${offerId}`;
  const offer = await apiPlatformClient.get(uri);
  if (offer && offer.status === "published") {
    return offer;
  }
  return null;
}

export async function getOfferDetailById(offerId) {
  let uri = `${URI_OFFER_BY_ID}${offerId}`;
  const offer = await apiPlatformClient.get(uri);
  if (offer && offer.id) {
    return offer;
  }
  return null;
}

export async function getOffersByOwner(ownerId) {
  let uri = `${URI_OFFERS}?owner.id=${ownerId}&status[]=published&status[]=unpublished`;
  const offer = await apiPlatformClient.get(uri);
  if (offer) {
    return offer;
  }
  return null;
}

export async function getOffersBy(offer) {
  const { location, checkIn, checkOut, page, guests, priceMin, priceMax } =
    offer;
  let params = [];

  if (location) {
    params.push(`search=${location}`);
  }
  if (checkIn && checkOut) {
    params.push(`startDate=${checkIn}`);
    params.push(`endDate=${checkOut}`);
  }
  if (page) {
    params.push(`page=${page}`);
  }
  if (guests) {
    params.push(`capacity[gte]=${guests}`);
  }
  if (priceMin) {
    params.push(`unitPrice[gte]=${priceMin}`);
  }
  if (priceMax) {
    params.push(`unitPrice[lte]=${priceMax}`);
  }
  // always search published offers only
  params.push("status=published");

  const formattedParams = params.join("&");
  const uri = `${URI_OFFERS}?${formattedParams}`;

  const offers = await apiPlatformClient.get(uri, {
    accept: "application/ld+json",
  });

  let offersData = {
    offers: offers["hydra:member"],
    totalItems: offers["hydra:totalItems"],
  };
  return offersData;
}

export async function removeOffer(offerId) {
  const uri = `${URI_OFFER_BY_ID}${offerId}`;
  await apiPlatformClient.put(uri, { payload: { status: "deleted" } });
}

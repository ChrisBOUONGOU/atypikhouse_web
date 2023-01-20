export const URI_CUSTOMERS = "/api/customers";
export const URI_OWNERS = "/api/owners";

export const URI_OFFERS_SEARCH = "/api/offers/search";

export const URI_OFFER_BY_ID = "/api/offers/get/";
export const URI_OFFER_CREATE = "/api/owner/offer/create";
export const URI_OFFER_UPDATE = "/api/owner/offer/update";
export const URI_OFFER_DELETE = "/api/owner/offer/delete/";

export const URI_OFFER_MEDIA_UPLOAD = "/api/owner/offer/upload";
export const URI_OFFER_MEDIA_DELETE = "/api/owner/media/delete/";

export const URI_OFFER_HIGHLIGHT_DELETE = "/api/owner/highlight/delete/";

export const URI_BACKOFFICE_PERSIST = "/api/backoffice/entity/persist/";

export const UPLOAD_PATH = process.env.AH_UPLOAD_PATH;

export const URI_DYNAMIC_PROP_BY_CATEGORY =
  "/api/offer-type/{otid}/dynamic-properties";

// addresses
export const URI_CITIES_BY_REGION = "/api/address/city?regionId=";

// used for select option value id
export const IRI_OFFER_TYPES = "/api/offer_types/";
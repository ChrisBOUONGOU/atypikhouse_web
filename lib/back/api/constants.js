export const API_URL = process.env.ATYPIKHOUSE_API_URL;
export const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : process.env.VERCEL_URL;

// Paypal config

export const PAYPAL_MODE = process.env.PAYPAL_MODE;
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Google Maps conf
export const COOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Collection/Categories URIs
export const URI_CATEGORY_TRENDING = "/api/offer_types?page=1&isTrending=true";
export const URI_CATEGORIES = "/api/offer_types";
export const URI_CATEGORY = "/api/offer_types/";

// Offers URIs
export const URI_OFFERS = "/api/offers";
export const URI_OFFERS_BY_ID = "/api/offers/";
export const URI_OFFERS_OF_CATEGORY = "/api/offers?offerType=";

// AboutUs URI
export const URI_ABOUT_US = "/api/about_us";

// Reservation URI
export const URI_RESERVATION = "/api/reservations";
export const URI_RESERVATION_BY_ID = "/api/reservations/";

// Users URIs
export const URI_USERS = "/api/users";
export const URI_USERS_BY_ID = "/api/users/";
export const URI_OFFER_BY_ID = "/api/offers/";
export const URI_USERS_LOGIN = "/login";

// Adress URIs
export const URI_ADDRESS_BY_ID = "/api/addresses/";
export const URI_REGIONS_BY_COUNTRY = "/api/regions?country.name=";
export const URI_CITIES_BY_REGION = "/api/cities?region.id=";

// Favorites URIs
export const URI_FAVORITES = "/api/favorites";
export const URI_FAVORITES_BY_ID = "/api/favorites/";

// offerComments URIs
export const URI_OFFER_COMMENTS = "/api/offer_comments";
export const URI_OFFER_COMMENTS_BY_ID = "/api/offer_comments/";

// socialMedia URIs
export const URI_SOCIAL_MEDIAS = "/api/social_media";

// DynamicProperties URIs
export const URI_DYNAMIC_PROPERTIES = "/api/dynamic_properties";

// Equipment URIs
export const URI_EQUIPMENTS = "/api/equipment/";

// DynamicPropValue URIs
export const URI_DYNAMIC_PROPERTIES_VALUE = "/api/dynamic_property_values/";

// Medias URIs
export const URI_MEDIAS = "/api/media";

// Highlights URIs
export const URI_HIGHLIGHTS = "/api/highlights";

// Backoffice managed entities
export const MANAGED_ENTITIES = [
  {
    name: "A propos de nous",
    url: "about_us",
    isEditable: true,
    isInsertable: false,
    isRemovable: false,
    fields: [{ fieldType: "FormInput", name: "content", label: "Contenu" }],
  },
  {
    name: "Collection des Offres",
    url: "offer_types",
    isEditable: true,
    isInsertable: true,
    isRemovable: false,
    fields: [
      { fieldType: "FormInput", name: "name", label: "Nom de la collection" },
      { fieldType: "FormBoolean", name: "isTrending", label: "Trending" },
      {
        fieldType: "FormFile",
        name: "imageUrl",
        label: "Image de la collection",
      },
    ],
  },
  {
    name: "Commentaires des offres",
    url: "offer_comments",
    isEditable: true,
    isInsertable: false,
    isRemovable: true,
    fields: [
      {
        fieldType: "FormSelect",
        name: "status",
        label: "Status",
        selectOptions: [
          { value: "approved", displayValue: "approuvé" },
          { value: "rejected", displayValue: "rejeté" },
        ],
      },
    ],
  },
  {
    name: "Equipement",
    url: "equipment",
    isEditable: true,
    isInsertable: true,
    isRemovable: true,
    fields: [
      { fieldType: "FormInput", name: "name", label: "Nom de l'équipement" },
    ],
  },
  {
    name: "Messages",
    url: "offer_messages",
    isEditable: false,
    isInsertable: false,
    isRemovable: false,
  },
  {
    name: "Offres",
    url: "offers",
    isEditable: true,
    isInsertable: false,
    isRemovable: true,
    fields: [
      { fieldType: "FormInput", name: "title", label: "Titre de l'offre" },
      {
        fieldType: "FormSelect",
        name: "status",
        label: "Status",
        selectOptions: [
          { value: "published", displayValue: "Publiée" },
          { value: "unpublished", displayValue: "Non publiée" },
          { value: "deleted", displayValue: "Supprimée" },
        ],
      },
    ],
  },
  {
    name: "Pays",
    url: "countries",
    isEditable: false,
    isInsertable: false,
    isRemovable: false,
  },
  {
    name: "Proprietes dynamiques",
    url: "dynamic_properties",
    isEditable: true,
    isInsertable: true,
    isRemovable: true,
  },
  {
    name: "Regions",
    url: "regions",
    isEditable: false,
    isInsertable: false,
    isRemovable: false,
  },
  {
    name: "Reseaux Sociaux",
    url: "social_media",
    isEditable: true,
    isInsertable: true,
    isRemovable: true,
    fields: [
      { fieldType: "FormInput", name: "name", label: "Nom du réseau social" },
      { fieldType: "FormInput", name: "url", label: "URL du réseau social" },
      {
        fieldType: "FormFile",
        name: "imageUrl",
        label: "URL de l'image du réseau social",
      },
    ],
  },
  {
    name: "Reservations",
    url: "reservations",
    isEditable: false,
    isInsertable: false,
    isRemovable: false,
  },
  {
    name: "Users",
    url: "users",
    isEditable: true,
    isInsertable: false,
    isRemovable: false,
  },
  {
    name: "Villes",
    url: "cities",
    isEditable: false,
    isInsertable: false,
    isRemovable: false,
  },
];

export const MANAGED_ENTITIES_BASE_URL = "/api/";

export const USER_TABLE_NAME = "users";
export const DYNAMIC_PROPERTIES_TABLE_NAME = "dynamic_properties";
export const OFFER_TYPE_TABLE_NAME = "offer_types";

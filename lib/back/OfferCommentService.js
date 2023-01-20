import apiPlatformClient from "./api/apiPlatformClient";
import { URI_OFFER_COMMENTS } from "./api/constants";
import { getUser } from "./UserService";

export async function getOfferCommentsByOfferId(offerId, pageNumber = 1) {
  if (offerId) {
    let uri = `${URI_OFFER_COMMENTS}?offer=${offerId}&page=${pageNumber}&status=approved`;
    const offerComments = await apiPlatformClient.get(uri, {
      accept: "application/ld+json",
    });
    let offerCommentsData = {
      offerComments: offerComments["hydra:member"],
      totalItems: offerComments["hydra:totalItems"],
    };
    return offerCommentsData;
  }
  return [];
}

export async function getCurrentUserCommentForOffer(offerId, session) {
  const user = await getUser(session);
  if (offerId && user) {
    const userId = user.id;
    let uri = `${URI_OFFER_COMMENTS}?offer=${offerId}&client=${userId}`;
    const CurrentUserCommentForOffer = await apiPlatformClient.get(uri);
    return CurrentUserCommentForOffer;
  }
  return [];
}

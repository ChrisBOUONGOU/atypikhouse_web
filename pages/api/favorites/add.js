import { getSession } from "next-auth/react";
import apiPlatformClient from "../../../lib/back/api/apiPlatformClient";
import {
  URI_FAVORITES,
  URI_OFFERS_BY_ID,
  URI_USERS_BY_ID,
} from "../../../lib/back/api/constants";
import { getUser } from "../../../lib/back/UserService";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }
  const user = await getUser(session);
  if (user && req.method === "POST") {
    const { offerId } = req.body;
    const userId = user.id;

    const favoriteResponse = await apiPlatformClient.post(URI_FAVORITES, {
      accept: "application/json",
      payload: {
        user: `${URI_USERS_BY_ID}${userId}`,
        offer: `${URI_OFFERS_BY_ID}${offerId}`,
      },
    });

    return res.send({ favId: favoriteResponse.id });
  }
  return res.status(404).json({ error: "Error occured" });
}

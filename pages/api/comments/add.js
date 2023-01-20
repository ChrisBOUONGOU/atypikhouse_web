import { getSession } from "next-auth/react";
import apiPlatformClient from "../../../lib/back/api/apiPlatformClient";
import {
  URI_OFFERS_BY_ID,
  URI_OFFER_COMMENTS,
  URI_USERS_BY_ID,
} from "../../../lib/back/api/constants";
import { getUser } from "../../../lib/back/UserService";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }
  const user = await getUser(session);
  if (req.method === "POST") {
    const { offerId, content } = req.body;
    const userId = user.id;

    const response = await apiPlatformClient.post(URI_OFFER_COMMENTS, {
      accept: "application/json",
      payload: {
        content: content,
        client: `${URI_USERS_BY_ID}${userId}`,
        offer: `${URI_OFFERS_BY_ID}${offerId}`,
      },
    });
    console.log(response);

    return res.send({});
  }
  return res.status(404).json({ error: "Error occured" });
}

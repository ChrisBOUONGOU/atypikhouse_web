import { getSession } from "next-auth/react";
import { createOffer } from "../../../../lib/back/OfferService";
import { getUser } from "../../../../lib/back/UserService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await doPost(req, res);
  }
  return res.status(404);
}

async function doPost(req, res) {
  const session = await getSession({ req });
  const user = await getUser(session);
  let queryBody = { ...req.body, owner: `/api/users/${user.id}` };

  if (queryBody.equipments) {
    for (let index = 0; index < queryBody.equipments.length; index++) {
      queryBody.equipments[
        index
      ] = `/api/equipment/${queryBody.equipments[index]}`;
    }
  }
  
  const offer = await createOffer(queryBody);
  if (offer && offer.id) {
    return res.status(200).json({ data: offer });
  }

  return res.status(400).json({ error: "Error occured" });
}

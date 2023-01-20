import { updateOffer } from "../../../../../lib/back/OfferService";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await doGet(req, res);
  }
  return res.status(404);
}

async function doGet(req, res) {
  const offerId = req.query.oid;

  const payload = {
    status: "deleted",
  };

  const offer = await updateOffer(offerId, payload);
  if (offer && offer.id) {
    return res.status(200).json({ data: offer });
  }

  return res.status(400).json({ error: "Error occured" });
}

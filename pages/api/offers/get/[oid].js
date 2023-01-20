import { getOfferDetailById } from "../../../../lib/back/OfferService";

export default async function handler(req, res) {
  if (req.method === "GET" && req.query.oid) {
    const offer = await getOfferDetailById(req.query.oid);
    if (offer && offer.id) {
      return res.status(200).json({ data: offer });
    }
  }
  return res.status(404);
}

import { getOffersBy } from "../../../lib/back/OfferService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const offers = await getOffersBy(req.body);
    if (offers && Array.isArray(offers)) {
      return res.status(200).json({ data: offers });
    }
    return res.status(400).json({ error: "Error occured" });
  }
  return res.status(404);
}

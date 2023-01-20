import { getCitiesByRegion } from "../../../lib/back/AddressService";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const regionId = req.query.regionId;
    let cities = await getCitiesByRegion(regionId);
    if (cities) {
      return res.status(200).json({ data: cities });
    }

    return res.status(400).json({ error: "Error occured" });
  }
  return res.status(404);
}

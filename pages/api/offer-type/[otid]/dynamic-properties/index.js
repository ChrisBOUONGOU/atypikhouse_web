import { getDynamicPropertiesByCategory } from "../../../../../lib/back/DynamicPropertyService";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const categoryId = req.query.otid;
    let dynamicProperties = await getDynamicPropertiesByCategory(categoryId);
    if (dynamicProperties) {
      return res.status(200).json({ data: dynamicProperties });
    }

    return res.status(400).json({ error: "Error occured" });
  }
  return res.status(404);
}

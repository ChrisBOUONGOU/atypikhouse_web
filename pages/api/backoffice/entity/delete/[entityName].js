import { removeEntity } from "../../../../../lib/back/BackofficeService";
import { removeOffer } from "../../../../../lib/back/OfferService";
import { URL_BACKOFFICE_MANAGE_DISPLAY } from "../../../../../lib/front/web/constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return doDelete(req, res);
  }
  res.send(404);
}

async function doDelete(req, res) {
  const entityName = req.query.entityName;
  const id = req.query.id;

  if (entityName === "offers") {
    await removeOffer(id);
  } else {
    await removeEntity(entityName, id);
  }

  return res.status(200).json({ data: { id: id } });
}

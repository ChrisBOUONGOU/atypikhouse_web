import { deleteHighlightById } from "../../../../../lib/back/HighlightService";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await doGet(req, res);
  }
  return res.status(404);
}

async function doGet(req, res) {
  // const session = await getSession({ req });
  // const user = await getUser(session);

  const highlghtId = req.query.hid;

  if (!highlghtId) {
    return res.status(404);
  }

  const isDeleted = await deleteHighlightById(highlghtId);

  if (isDeleted) {
    return res.status(200).json({ data: "deleted" });
  }

  return res.status(400).json({ error: "Error occured" });
}

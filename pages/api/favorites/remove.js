import { getSession } from "next-auth/react";
import apiPlatformClient from "../../../lib/back/api/apiPlatformClient";
import { URI_FAVORITES_BY_ID } from "../../../lib/back/api/constants";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
  }
  if (req.method === "DELETE") {
    const { fid } = req.query;
    await apiPlatformClient.delete(URI_FAVORITES_BY_ID + fid);

    res.send({ result: "success" });
    return;
  }
  return res.status(404).json({ error: "Error occured" });
}

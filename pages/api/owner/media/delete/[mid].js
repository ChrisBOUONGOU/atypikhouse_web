import { getSession } from "next-auth/react";
import {
  deleteMediaById,
  getMediaById,
} from "../../../../../lib/back/MediaService";
import { getUser } from "../../../../../lib/back/UserService";
import fs from "fs";
import { UPLOAD_PATH } from "../../../../../lib/front/api/constants";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await doGet(req, res);
  }
  return res.status(404);
}

async function doGet(req, res) {
  const session = await getSession({ req });
  const user = await getUser(session);

  const mediaId = req.query.mid;

  if (!mediaId) {
    return res.status(404);
  }

  // fetch Media to get url ==> delete file
  const media = await getMediaById(mediaId);

  if (!media) {
    return res.status(404);
  }

  const isDeleted = await deleteMediaById(mediaId);

  // Make sure media entry is deleted from database before deleting file
  // avoid 404 on offer pages
  if (isDeleted) {
    const filePath = getFilePath(media);
    fs.unlink(filePath, (err) => err && console.log(err));
    return res.status(200).json({ data: "deleted" });
  }

  return res.status(400).json({ error: "Error occured" });
}

function getFilePath(media) {
  let urlParts = media.url.split("/");
  const fileName = urlParts.pop();
  return `${UPLOAD_PATH}${fileName}`;
}

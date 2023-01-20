import formidable from "formidable";
import fs from "fs";
import { createMedias } from "../../../../lib/back/MediaService";
import { getOfferDetailById } from "../../../../lib/back/OfferService";
import { UPLOAD_PATH } from "../../../../lib/front/api/constants";

// disable NextJS default request body Parser
// to allow formdidable library to parse FormData correclty
export const config = {
  api: {
    bodyParser: false,
  },
};

// REQUEST Handler : First to execute
export default async function handler(req, res) {
  if (req.method === "POST") {
    return doPost(req, res);
  }
  res.send(404);
}

const doPost = async (req, res) => {
  const formOptions = {
    // max size 4mb
    maxFileSize: 4 * 1024 * 1024,
    allowEmptyFiles: false,

    filter: function ({ mimetype }) {
      // keep only images
      return mimetype && mimetype.includes("image");
    },
  };
  const form = new formidable.IncomingForm(formOptions);

  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: "File upload failed." });
    }

    const uploadedMedias = await uploadMedias(files, fields.offerId);

    const results = await createMedias(uploadedMedias);

    if (results && Array.isArray(results)) {
      return res.status(200).json({ data: results });
    }

    return res.status(400).json({ error: "File upload failed." });
  });
};

async function uploadMedias(files, offerId) {
  // get Form Input Names (for input type file)
  const filesKeys = Object.keys(files);

  // get Offer
  const offer = await getOfferDetailById(offerId);
  // check if can add more photos (max 9 photos)
  if (offer && offer.media && offer.media.length) {
    const totalMediasCount = filesKeys.length + offer.media.length;
    if (totalMediasCount > 9) {
      return [];
    }
  }

  let uploadedMediasURLs = [];

  for (const inputFileName of filesKeys) {
    const generatedFileURL = await saveFile(files[inputFileName]);

    uploadedMediasURLs.push({
      url: generatedFileURL,
      alt: "Photo de l'offre",
      offer: "/api/offers/" + offerId,
    });
  }

  return uploadedMediasURLs;
}

const saveFile = async (file) => {
  const fileContent = fs.readFileSync(file.filepath);
  const fileUploadPath = `${UPLOAD_PATH}${file.newFilename}.jpeg`;
  fs.writeFileSync(fileUploadPath, fileContent);
  fs.unlinkSync(file.filepath);

  return `/medias/${file.newFilename}.jpeg`;
};

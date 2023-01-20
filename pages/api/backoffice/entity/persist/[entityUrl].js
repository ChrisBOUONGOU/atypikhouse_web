import formidable from "formidable";
import fs from "fs";
import { UPLOAD_PATH } from "../../../../../lib/front/api/constants";
import {
  isEntityEditable,
  persistEntity,
} from "../../../../../lib/back/BackofficeService";

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
    return post(req, res);
  }
  res.send(404);
}

const post = async (req, res) => {
  const entityUrl = req.query.entityUrl;
  if (!isEntityEditable(entityUrl)) {
    return res.send(404);
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    // get files as Array of [ {imageUrl: 'url value'}, {offerUrl: 'url value'}]
    const uploadedDataList = await uploadFiles(files);
    const payload = mergeFieldsWithGeneratedFileURLs(fields, uploadedDataList);
    const result = await persistEntity(entityUrl, payload);
    return res.status(200).json({ data: result });
  });
};

async function uploadFiles(files) {
  // get Form Input Names (for input type file)
  const filesKeys = Object.keys(files);

  let uploadedFilesURLs = [];

  await filesKeys.forEach(async (inputFileName) => {
    const generatedFileURL = await saveFile(files[inputFileName]);
    // store input name and generated URL value for file
    // [inputFileName] ==> not an array ! => force set the key in obj from variable
    uploadedFilesURLs.push({ [inputFileName]: generatedFileURL });
  });
  return uploadedFilesURLs;
}

const saveFile = async (file) => {
  const fileContent = fs.readFileSync(file.filepath);
  console.log(">>>>>>>>>>>process.cwd()>>>", process.cwd());
  var path = require("path");

  const uploadDir = path.resolve(process.cwd(), `${UPLOAD_PATH}`);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>uploadDir>>", uploadDir);

  const fileUploadPath = `${uploadDir}/${file.newFilename}.jpeg`;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>fileUploadPath>>", fileUploadPath);

  fs.writeFileSync(fileUploadPath, fileContent);
  await fs.unlinkSync(file.filepath);

  return `/medias/${file.newFilename}.jpeg`;
};

function mergeFieldsWithGeneratedFileURLs(fields, uploadedDataList) {
  // Fix issue with Type Conversion in Server side
  // FormData Allows only string values
  // Convert fields to JSON and parse json on server side
  // to get correct type
  let parsedFields = JSON.parse(fields.ahFields);
  uploadedDataList.forEach((entry) => {
    parsedFields = { ...parsedFields, ...entry };
  });
  return parsedFields;
}

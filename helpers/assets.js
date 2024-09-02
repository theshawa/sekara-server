import fs from "fs";
import { mongoBucket } from "../server";

export const uploadAsset = async ({ filename, path, mimetype, metadata }) => {
  let uploadStream = mongoBucket.openUploadStream(filename, {
    metadata,
    contentType: mimetype,
  });

  const readStream = fs.createReadStream(path);

  await new Promise((resolve, reject) => {
    readStream
      .pipe(uploadStream)
      .on("finish", resolve("successfull"))
      .on("error", reject("error occured while creating stream"));
  });

  return uploadStream.id;
};

export const deleteAsset = async (id) => {
  await mongoBucket.delete(id);
};

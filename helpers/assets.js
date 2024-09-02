import fs from "fs";
import mongoose from "mongoose";
import { mongoBucket } from "../server.js";

export const findAsset = async (id) => {
  const files = await mongoBucket.find().toArray();
  return files.find((file) => file._id.toString() === id) || null;
};

export const uploadAsset = async ({ filename, path, mimetype, metadata }) => {
  let uploadStream = mongoBucket.openUploadStream(filename, {
    metadata: {
      contentType: mimetype,
      ...metadata,
    },
    contentType: mimetype,
  });

  const readStream = fs.createReadStream(path);

  await new Promise((resolve, reject) => {
    readStream.pipe(uploadStream);
    readStream.on("end", resolve);
    readStream.on("error", reject);
  });
  fs.unlinkSync(path);

  return uploadStream.id;
};

export const deleteAsset = async (id) => {
  let _id = typeof id === "string" ? id : id.toString();
  const found = await findAsset(_id);

  if (found) await mongoBucket.delete(new mongoose.Types.ObjectId(_id));
};

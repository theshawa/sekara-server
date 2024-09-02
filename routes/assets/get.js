import fs from "fs";
import mongoose from "mongoose";
import { findAsset } from "../../helpers/assets.js";
import { mongoBucket } from "../../server.js";
export const getAsset = async (req, res) => {
  const fileId = req.params.id;
  const found = await findAsset(fileId);
  if (!found) {
    const readStream = fs.createReadStream(`${process.cwd()}/public/dummy.jpg`);
    readStream.pipe(res);
  } else {
    let downloadStream = mongoBucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
    });

    downloadStream.pipe(res);
  }
};

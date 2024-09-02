import mongoose from "mongoose";
import { mongoBucket } from "../../server.js";

export const getAsset = (req, res) => {
  const fileId = req.params.id;

  let downloadStream = mongoBucket.openDownloadStream(
    new mongoose.Types.ObjectId(fileId)
  );

  downloadStream.on("file", (file) => {
    res.set("Content-Type", file.contentType);
  });

  downloadStream.pipe(res);
};

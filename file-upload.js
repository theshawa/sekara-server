import multer from "multer";

export const fileUpload = multer({ dest: `${process.cwd()}/uploads` });

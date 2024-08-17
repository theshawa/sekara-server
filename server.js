import bodyParser from "body-parser";
import cors from "cors";
import "express-async-errors";
import "./load-env.js";

import express from "express";
import mongoose from "mongoose";
import { errorHanlder } from "./middlewares/error-handler.js";
import { topicsRouter } from "./routes/topics/index.js";
import { userRouter } from "./routes/user/index.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("sekara server working");
});
app.use("/user", userRouter);
app.use("/topics", topicsRouter);

app.use(errorHanlder);

const connectionString = process.env.ATLAS_URI || "";
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database connected");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });

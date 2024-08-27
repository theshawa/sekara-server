import bodyParser from "body-parser";
import cors from "cors";
import "express-async-errors";
import "./load-env.js";

import express from "express";
import mongoose from "mongoose";
import { errorHanlder } from "./middlewares/error-handler.js";
import { articlesRouter } from "./routes/articles/index.js";
import { commentsRouter } from "./routes/comments/index.js";
import { topicsRouter } from "./routes/topics/index.js";
import { userRouter } from "./routes/user/index.js";

const app = express();

// Middlewares

// cors middleware to allow cross-origin requests
app.use(cors());

// body parser middleware to parse request body
app.use(bodyParser.json({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// default route
app.get("/", (req, res) => {
  res.send("sekara server working");
});

app.use("/user", userRouter);
app.use("/topics", topicsRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);

// error handler middleware to catch all errors
app.use(errorHanlder);

// Database connection and server start
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

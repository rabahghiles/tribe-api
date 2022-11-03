import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import UserRouter from "./src/user/user.routes";
import StoriesRouter from "./src/story/story.routes";

// Use .env
require("dotenv").config();

// App
const app = express();
const port = process.env.PORT || 3000;

// MongoDb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DATABASE_URL);

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/users", UserRouter);
app.use("/api/stories", StoriesRouter);

// Server
app.listen(port, () => {
    console.log("Server running on port :", port)
});
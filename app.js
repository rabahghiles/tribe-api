import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import UserRouter from "./src/user/user.routes";

const app = express();

// Use .env
require("dotenv").config();

const port = process.env.PORT || 3000;

// Connection mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DATABASE_URL);

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/users", UserRouter);

// Server
app.listen(port, () => {
    console.log("Server running on port :", port)
});
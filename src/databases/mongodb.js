import mongoose from "mongoose";

require("dotenv").config();

// MongoDb
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DATABASE_URL);

// export default mongoose.createConnection(process.env.MONGODB_DATABASE_URL);
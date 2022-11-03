import admin from "firebase-admin";

require("dotenv").config();

const serviceAccount = require(`${__dirname}/../../${process.env.FIREBASE_SERVICE_ACCOUNT}`)
admin.Promise = global.Promise;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRESTORE_DATABASE_URL
})

export default admin.firestore();
import * as admin from "firebase-admin";
// import * as serviceAccount from "./key.json";

const firebaseConfig = admin.credential.cert(
  JSON.parse(process.env.FIREBASE_CONFIG)
);

admin.initializeApp({
  credential: firebaseConfig,
  databaseURL: process.env.DB_URL,
});

const rtDb = admin.database();
const fsDb = admin.firestore();

export { fsDb, rtDb };

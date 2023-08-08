import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: process.env.DB_URL,
});

const rtDb = admin.database();
const fsDb = admin.firestore();

export { rtDb, fsDb };

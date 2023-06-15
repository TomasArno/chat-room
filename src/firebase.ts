import firebase from "firebase";

const APP = firebase.initializeApp({
  apiKey: "FqhIRDR4EqsgWVtVAbpYR2EV06EoI05IhXftIs8x",
  databaseURL: process.env.DB_URL,
  authDomain: "proteo-2a2ac.firebaseapp.com",
  projectId: "proteo-2a2ac",
});

const rtDb = firebase.database(APP);
const fsDb = firebase.firestore(APP);

export { rtDb, fsDb };

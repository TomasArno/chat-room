import firebase from "firebase";

const API_BASE_URL = "https://rooms-deploy.onrender.com/";

const APP = firebase.initializeApp({
  apiKey: "FqhIRDR4EqsgWVtVAbpYR2EV06EoI05IhXftIs8x",
  databaseURL: "https://proteo-2a2ac-default-rtdb.firebaseio.com/",
  authDomain: "proteo-2a2ac.firebaseapp.com",
  projectId: "proteo-2a2ac",
});

const rtDb = firebase.database(APP);
const fsDb = firebase.firestore(APP);

export { rtDb, fsDb, API_BASE_URL };

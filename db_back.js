"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtDb = exports.fsDb = void 0;
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://proteo-2a2ac-default-rtdb.firebaseio.com",
});
var rtDb = admin.database();
exports.rtDb = rtDb;
var fsDb = admin.firestore();
exports.fsDb = fsDb;

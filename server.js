"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var db_back_1 = require("./db_back");
var uuid_1 = require("uuid");
var cors = require("cors");
var app = express();
var port = 2000;
app.use(express.json());
app.use(cors());
var usersColl = db_back_1.fsDb.collection("users");
var roomsColl = db_back_1.fsDb.collection("rooms");
app.post("/auth", function (req, res) {
    var email = req.body.email;
    usersColl
        .where("email", "==", email)
        .get()
        .then(function (searchedEmail) {
        if (searchedEmail.empty) {
            res.status(400).json({ err: "Email not found" });
        }
        else {
            res.json({ id: searchedEmail.docs[0].id });
        }
    });
});
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    usersColl
        .where("email", "==", email)
        .get()
        .then(function (searchedEmail) {
        if (searchedEmail.empty) {
            usersColl
                .add({
                email: email,
                name: name,
            })
                .then(function (userRef) {
                res.json({ userId: userRef.id });
            });
        }
        else {
            res.status(400).json({ err: "User already exists" });
        }
    });
});
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    usersColl
        .doc(userId)
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = db_back_1.rtDb.ref("rooms/".concat((0, uuid_1.v4)().replaceAll("-", "")));
            roomRef_1
                .set({
                messages: [0],
                owner: userId,
            })
                .then(function () {
                var roomLongId = roomRef_1.key;
                var roomId = (1000 + Math.floor(Math.random() * 999)).toString();
                roomsColl
                    .doc(roomId)
                    .set({
                    rtDbRoomId: roomLongId,
                })
                    .then(function () {
                    res.json({ roomId: roomId });
                });
            });
        }
        else {
            res
                .status(401)
                .json({ err: "User ID does not exist, please authenticate" });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            roomsColl
                .doc(roomId)
                .get()
                .then(function (snap) {
                if (snap.exists) {
                    var data = snap.data();
                    res.json(data);
                }
                else {
                    res.status(401).json({ err: "Entered room does not exist" });
                }
            });
        }
        else {
            res
                .status(401)
                .json({ err: "User ID does not exist, please authenticate" });
        }
    });
});
app.post("/messages", function (req, res) {
    var roomId = req.query.roomId;
    var messageListRef = db_back_1.rtDb.ref("rooms/".concat(roomId, "/messages"));
    messageListRef.get().then(function (snap) {
        if (snap.exists()) {
            var messages = snap.val();
            if (!messages) {
                messages = [];
            }
            messages.push(req.body);
            messageListRef.set(messages, function () { return res.json({ res: "Message sent!" }); });
        }
        else {
            res.status(401).json({ err: "Entered room does not exist" });
        }
    });
});
app.listen(port, function () {
    console.log("running server on port ".concat(port));
});

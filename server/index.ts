import * as express from "express";
import * as path from "path";
import { fsDb, rtDb } from "./db_admin";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";
const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());
app.use(cors());

const usersColl = fsDb.collection("users");
const roomsColl = fsDb.collection("rooms");

app.get("/env", (req, res) => {
  res.json({ environment: process.env.ENVIRONMENT });
});
app.get("/db-host", (req, res) => {
  res.json({ dataBaseUrl: process.env.DB_URL });
});

app.post("/auth", (req, res) => {
  const { email } = req.body;

  usersColl
    .where("email", "==", email)
    .get()
    .then((searchedEmail) => {
      if (searchedEmail.empty) {
        res.status(400).json({ err: "Email not found" });
      } else {
        res.json({ id: searchedEmail.docs[0].id });
      }
    });
});

app.post("/signup", (req, res) => {
  const { email } = req.body;
  const { name } = req.body;

  usersColl
    .where("email", "==", email)
    .get()
    .then((searchedEmail) => {
      if (searchedEmail.empty) {
        usersColl
          .add({
            email,
            name,
          })
          .then((userRef) => {
            res.json({ userId: userRef.id });
          });
      } else {
        res.status(400).json({ err: "User already exists" });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  usersColl
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtDb.ref(`rooms/${uuidv4()}`);
        roomRef
          .set({
            messages: [0],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = (1000 + Math.floor(Math.random() * 999)).toString();
            roomsColl
              .doc(roomId)
              .set({
                rtDbRoomId: roomLongId,
              })
              .then(() => {
                res.json({ roomId });
              });
          });
      } else {
        res
          .status(401)
          .json({ err: "User ID does not exist, please authenticate" });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query as any;
  const { roomId } = req.params;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsColl
          .doc(roomId)
          .get()
          .then((snap) => {
            if (snap.exists) {
              const data = snap.data();
              res.json(data);
            } else {
              res.status(401).json({ err: "Entered room does not exist" });
            }
          });
      } else {
        res
          .status(401)
          .json({ err: "User ID does not exist, please authenticate" });
      }
    });
});

app.post("/messages", (req, res) => {
  const { roomId } = req.query;

  const messageListRef = rtDb.ref(`rooms/${roomId}/messages`);
  messageListRef.get().then((snap) => {
    if (snap.exists()) {
      let messages = snap.val();
      if (!messages) {
        messages = [];
      }
      messages.push(req.body);
      messageListRef.set(messages, () => res.json({ res: "Message sent!" }));
    } else {
      res.status(401).json({ err: "Entered room does not exist" });
    }
  });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`running server on port ${port}`);
});

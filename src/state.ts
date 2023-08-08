import { rtDb } from "./firebase";
import { newState, FormData } from "./interfaces";

const API_BASE_URL = process.env.API_URL;

export const state = {
  data: {
    userId: "",
    email: "",
    userName: "",
    longRoomId: "",
    shortRoomId: "",
    messagesList: [],
    option: "",
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState: newState) {
    this.data = newState;
    for (const cb of this.listeners as any) {
      cb();
    }
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  connectChatroom() {
    const lastState: newState = this.getState();

    const chatRoomsRef = rtDb.ref(`/rooms/${lastState.longRoomId}/messages`);

    chatRoomsRef.on("value", (snapshot) => {
      const messages = snapshot.val() as [];

      lastState.messagesList = messages.slice(1);

      this.setState(lastState);
    });
  },

  hasBasicCredentials() {
    const cs: newState = this.getState();

    if (cs.email && cs.userName && cs.option) {
      return true;
    } else {
      return false;
    }
  },

  setBasicData(formData: FormData) {
    const lastState: newState = this.getState();

    lastState.userName = formData.userName;
    lastState.email = formData.email;
    lastState.option = formData.option;
    lastState.shortRoomId = formData.shortRoomId || "";

    this.setState(lastState);
  },

  async main(callback: () => any) {
    if (this.hasBasicCredentials()) {
      await this.signIn();

      const lastState: newState = this.getState();

      if (!lastState.userId) {
        await this.signUp();
      }

      if (lastState.option == "new") {
        await this.createRoom();
        await this.joinRoom();
      } else {
        await this.joinRoom();
      }

      const cs: newState = this.getState();
      if (cs.longRoomId) {
        callback();
      }
    } else {
      console.error("You must complete the form");
    }
  },

  async signIn() {
    const lastState: newState = this.getState();

    const authData = await fetch(
      API_BASE_URL + `/users?email=${lastState.email}`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    if (authData.status == 400) {
      const { err } = await authData.json();
      console.error(err);
    } else {
      const { id } = await authData.json();
      lastState.userId = id;

      state.setState(lastState);
      console.log("Autenticación aceptada, este es su id: " + id);
    }
  },

  async signUp() {
    const lastState: newState = this.getState();

    const userIdData = await fetch(API_BASE_URL + "/users", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: lastState.email,
        name: lastState.userName,
      }),
    });

    if (userIdData.status == 400) {
      const { err } = await userIdData.json();
      console.error(err);
    } else {
      const { userId } = await userIdData.json();
      lastState.userId = userId;

      state.setState(lastState);
      console.log("Usuario creado, este es su id: " + userId);
    }
  },

  async createRoom() {
    const lastState: newState = this.getState();

    if (lastState.userId) {
      const roomIdData = await fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: lastState.userId,
        }),
      });

      if (roomIdData.status == 401) {
        const { err } = await roomIdData.json();
        console.error(err);
      } else {
        const { roomId } = await roomIdData.json();

        lastState.shortRoomId = roomId;
        state.setState(lastState);
      }
    }
  },

  async joinRoom() {
    const lastState: newState = this.getState();

    const rtDbRoomIdData = await fetch(
      API_BASE_URL +
        `/rooms/${lastState.shortRoomId}?userId=${lastState.userId}`
    );
    if (rtDbRoomIdData.status == 401) {
      const { err } = await rtDbRoomIdData.json();
      console.error(err);
    } else {
      const { rtDbRoomId } = await rtDbRoomIdData.json();
      lastState.longRoomId = rtDbRoomId;

      state.setState(lastState);
    }
  },

  async sentMessage(message: { msg: string }) {
    const lastState: newState = this.getState();

    const { msg } = message;

    if (msg) {
      const sentMessage = await fetch(
        API_BASE_URL + `/messages?roomId=${lastState.longRoomId}`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userName: lastState.userName,
            msg,
          }),
        }
      );
      if (sentMessage.status == 401) {
        const { err } = await sentMessage.json();
        console.error(err);
      }
    } else {
      console.error("You can't send empty messages");
    }
  },
};

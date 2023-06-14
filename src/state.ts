import { API_BASE_URL, rtDb } from "./firebase";
type newState = {
  userName: string;
  longRoomId: string;
  shortRoomId: string;
  messagesList: any;
  userId: string;
  email: string;
  option: string;
};

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
    console.log("soy el suscribe");

    this.listeners.push(callback);
  },
  connectChatroom() {
    const lastState = this.getState();
    console.log("me conecto al chatroom", lastState);

    const chatRoomsRef = rtDb.ref(`/rooms/${lastState.longRoomId}/messages`);

    chatRoomsRef.on("value", (snapshot) => {
      console.log("CAMBIOS");
      const messages = snapshot.val() as [];

      lastState.messagesList = messages.slice(1);
      console.log(lastState.messagesList);

      this.setState(lastState);
    });
  },
  async main(callback: any) {
    await this.signIn();

    const lastState = state.getState();

    if (!lastState.userId) {
      await this.signUp();
    }

    if (lastState.option == "new") {
      await this.createRoom();
      await this.joinRoom();
    } else {
      await this.joinRoom();
    }

    const cs = state.getState();
    if (cs.longRoomId) {
      callback();
    }
  },
  setBasicData(formData: {
    email: string;
    userName: string;
    option: string;
    shortRoomId?: string;
  }) {
    const lastState = this.getState();
    lastState.userName = formData.userName;
    lastState.email = formData.email;
    lastState.option = formData.option;
    if (formData.shortRoomId) {
      lastState.shortRoomId = formData.shortRoomId;
    }
    this.setState(lastState);
  },
  async signIn() {
    const lastState = this.getState();
    if (lastState.email && lastState.userName) {
      const authData = await fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: lastState.email,
        }),
      });

      if (authData.status == 400) {
        const { err } = await authData.json();
        console.error(err);
      } else {
        const { id } = await authData.json();
        lastState.userId = id;

        state.setState(lastState);
        console.log("Autenticación aceptada, este es su id: " + id);
      }
    } else {
      console.error("You must complete the form");
    }
  },
  async signUp() {
    const lastState = this.getState();
    const userIdData = await fetch(API_BASE_URL + "/signup", {
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
    const lastState = this.getState();
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
    const lastState = this.getState();

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
    const lastState = this.getState();
    const { msg } = message;

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
  },
};

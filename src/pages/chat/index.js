"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../../state");
customElements.define("init-chat", class InitChat extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
        .gen-container {
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          row-gap: 20px;
        }

        .msg-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          row-gap: 6px;
          overflow: scroll;
          padding: 0 20px;
        }

        .p {
          margin: 0;
          font-size: 20px;
        }

        .btn-container {
          max-width: 285px;
          margin: 0 auto 50px auto;
        }
            `;
        this.shadow.appendChild(style);
    }
    render() {
        console.log("Soy el chat");
        this.shadow.innerHTML = `
      <div class="gen-container">
        <div class="descrip-container">
          <h2 class="title">Chat</h2>
          <p class ="room-id">Room ID: ${state_1.state.data.shortRoomId}</p>
        </div>

        <div class="msg-container"></div>
        <div class="btn-container">
          <send-button location="chat"></send-button>
        </div>
      </div>`;
        const msgContainer = this.shadow.querySelector(".msg-container");
        state_1.state.subscribe(() => {
            const messagesList = state_1.state.getState().messagesList;
            console.log("suscribe del chat", messagesList);
            if (messagesList) {
                msgContainer.innerHTML = `
          ${messagesList
                    .map((element) => `<text-box sender="${element.userName}">${element.msg}</text-box>`)
                    .join("")}`;
            }
        });
        this.addStyles();
    }
});
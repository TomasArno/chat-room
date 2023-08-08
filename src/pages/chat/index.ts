import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "init-chat",
  class InitChat extends HTMLElement {
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;    
        }

        .gen-container {
          background: lightgrey;
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: 20px;
        }

        .wrapper {
          width: 100%;
        }

        .descrip-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .arrow_back_img {
          height: 16px;
          position: absolute;
          top: 15px;
          left: 15px;
        }

        .title {
          padding-top: 11px;
          text-align: center;
          font-size: 30px;
        }

        .room-id {
          width: 80%;
          max-width: 850px;
          text-align: end;
          font-size: 16px;
        }

        .msg-container {
          background: white;
          overflow-x: hidden;
          overflow-y: scroll;
          padding: 5px 20px 0 20px;
          
          width: 80%;
          max-width: 850px;
          height: 100%;

          box-shadow: 0px 1px 27px -7px #979797;

          display: flex;
          flex-direction: column;
        }

        .p {
          margin: 0;
          font-size: 20px;
        }

        .btn-container {
          padding: 0 20px;
        }
        
        @media (min-width: 375px){
          .btn-container {
            padding: 0;
            margin: 26px auto;
          }
        }
            `;
      this.shadow.appendChild(style);
    }

    render() {
      const arrowBackImg =
        require("../../images/arrow-ios-back_1.svg") as HTMLImageElement;

      this.shadow.innerHTML = `
      <div class="gen-container">
        <div class="wrapper">
          <img id="arrow_back" class="arrow_back_img" src="${arrowBackImg}" alt="logo">
          <div class="descrip-container"> 
            <h2 class="title">Chat</h2>
            <p class ="room-id">Room ID: ${state.data.shortRoomId}</p>
          </div>
        </div>

        <div class="msg-container"></div>
        <div class="btn-container">
          <send-button location="chat"></send-button>
        </div>
      </div>`;

      const msgContainer = this.shadow.querySelector(
        ".msg-container"
      ) as HTMLElement;

      state.subscribe(() => {
        const messagesList = state.getState().messagesList;

        if (messagesList) {
          msgContainer.innerHTML = `
          ${messagesList
            .map(
              (element: any) =>
                `<text-box sender="${element.userName}">${element.msg}</text-box>`
            )
            .join("")}`;
        }
      });

      this.addStyles();

      this.setListeners();
    }
    setListeners() {
      const arrowBackEl = this.shadow.getElementById(
        "arrow_back"
      ) as HTMLImageElement;

      arrowBackEl.addEventListener("click", () => {
        Router.go("/");
      });
    }
  }
);

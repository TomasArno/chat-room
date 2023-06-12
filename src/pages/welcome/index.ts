import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define(
  "init-welcome",
  class InitWelcome extends HTMLElement {
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
    
        .header {
          background: #FF8282;
          height: 40px;
        }

        .sign-container{
          height: calc(100% - 40px);
          display: flex;
          justify-content: center;
          align-items: center;
          background: lightgrey;
          padding: 40px 0;
        }

        .img {
          height: 100px;
          width: 100px;
        }

        .form-container {
          width: 360px;
          border-radius: 10px;
          padding: 20px;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
        }

        .form {
          margin-top: 50px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: 20px;
        }

        .label {
          width: 80%;
        }

        .p{
          margin: 0;
          font-size: 20px;
        }

        .input {
          width: 100%;
          padding: 8.85px 13px;
          height: 40px;
          font-size: 16px;
        }

        .label-room {
          display: none;
        }
            `;
      this.shadow.appendChild(style);
    }

    render() {
      this.shadow.innerHTML = `
        <header class="header"></header>
        <div class="sign-container">
          <div class="form-container">
              <img class="img" src="https://picsum.photos/200/200" alt="">

              <div class="form">
                <label class ="label-email label">
                  <input class="input email" type="text" name="label-email" placeholder="E-mail">
                </label>
                  
                <label class ="label-name label">
                  <input class="input name" type="text" name="label-name" placeholder="Username">
                </label>
                  
                <label class ="label-options label">
                  <p class="p">Room</p>
                  <select class="select input" name="label-options">
                    <option value="new">New room</option>
                    <option value="existing">Existing room</option>
                  </select>
                </label>
                
                <label class ="label-room label">
                  <input class="input room-id" type="text" name="label-name" placeholder="Room-ID">
                </label>
                
                <send-button class="form-btn" location="home"></send-button>

                </div>
          </div>
        </div>`;

      this.addListeners();
      this.addStyles();
    }
    addListeners() {
      const emailEl = this.shadow.querySelector(".email") as HTMLFormElement;
      const userNameEl = this.shadow.querySelector(".name") as HTMLFormElement;
      const selectRoomEl = this.shadow.querySelector(
        ".select"
      ) as HTMLFormElement;
      const labelRoomEl = this.shadow.querySelector(
        ".label-room"
      ) as HTMLFormElement;
      const choosedRoomEl = this.shadow.querySelector(
        ".room-id"
      ) as HTMLFormElement;
      const buttonEl = this.shadow.querySelector(
        ".form-btn"
      ) as HTMLFormElement;

      selectRoomEl.addEventListener("change", (e) => {
        const target = e.target as HTMLFormElement;
        const choosedOption = target.value;

        choosedOption == "existing"
          ? (labelRoomEl.style.display = "initial")
          : (labelRoomEl.style.display = "none");
      });

      buttonEl.addEventListener("click", (e) => {
        state.setBasicData({
          email: emailEl.value.toLowerCase(),
          userName: userNameEl.value.toLowerCase(),
          option: selectRoomEl.value,
          shortRoomId: choosedRoomEl.value,
        });

        state.main(() => {
          state.connectChatroom();
          Router.go("/chat");
        });
      });
    }
  }
);

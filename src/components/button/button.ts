import { state } from "../../state";

customElements.define(
  "send-button",
  class SendButton extends HTMLElement {
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
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            .container {
              display: flex;
              column-gap: 8px;
            }

            .input {
              padding-left: 20px;
              width: 100%;
              border-radius: 31px;
              display: none;
              font-size: 23px;
            }

            .button {
              border-color: black;
              height: 46px;
              min-width: 50px;
              border-radius: 76px;
            }

            .send_img_button{
              height: 29px;
              position: relative;
              left: 4px;
              top: 2px;
            }
        `;
      this.shadow.appendChild(style);
    }

    render() {
      const paperPlaneImg =
        require("../../images/send-button_icon-icons.com_72565.svg") as HTMLImageElement;

      this.shadow.innerHTML = `
        <div class="container">
            <input type="text" class="input"/>
            <button class="button"><img class="send_img_button" src="${paperPlaneImg}" alt="paper plane"></button>
        </div>`;

      const location = this.getAttribute("location");
      const buttonEl = this.shadow.querySelector(".button") as HTMLFormElement;
      const inputEl = this.shadow.querySelector(".input") as HTMLFormElement;

      if (location == "home") {
      } else {
        inputEl.style.display = "initial";
        buttonEl.addEventListener("click", (e) => {
          state.sentMessage({
            msg: inputEl.value,
          });
          inputEl.value = "";
        });
      }
      this.addStyles();
    }
    addListeners() {}
  }
);

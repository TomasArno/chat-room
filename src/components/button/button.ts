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
            .container {
                background: gray;
                width: 100%;
                min-width: 70px;
            }
            .input {
                box-sizing: border-box;
                width: 100%;
                height: 40px;
                display: none;
                font-size: 30px;
            }
            .button {
                width: 100%;
                height: 40px;
            }
        `;
      this.shadow.appendChild(style);
    }

    render() {
      this.shadow.innerHTML = `
        <div class="container">
            <input type="text" class="input"/>
            <button class="button"></button>
        </div>`;

      const location = this.getAttribute("location");
      const buttonEl = this.shadow.querySelector(".button") as HTMLFormElement;
      const inputEl = this.shadow.querySelector(".input") as HTMLFormElement;

      if (location == "home") {
        buttonEl.textContent = "Join";
      } else {
        inputEl.style.display = "initial";
        buttonEl.textContent = "Enviar";
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

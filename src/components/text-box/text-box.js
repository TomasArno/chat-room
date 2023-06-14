"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../../state");
customElements.define("text-box", class TextBox extends HTMLElement {
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
                    display: flex;
                    margin: 6px 0;
                }

                .message {
                    color: white;
                    max-width: 250px;
                    padding: 12px;
                    font-size: 18px;
                    border-radius: 3px;
                }
            `;
        this.shadow.appendChild(style);
    }
    render() {
        const userName = this.getAttribute("sender");
        const content = this.innerHTML;
        this.shadow.innerHTML = `
      <div class="container">
        <div class=message>${content}</div> 
      </div>`;
        const messageCont = this.shadow.querySelector(".container");
        const message = this.shadow.querySelector(".message");
        if (userName == state_1.state.data.userName) {
            messageCont.style.justifyContent = "flex-end";
            message.style.background = "red";
        }
        else {
            messageCont.style.justifyContent = "flex-start";
            message.style.background = "orange";
        }
        this.addStyles();
    }
});

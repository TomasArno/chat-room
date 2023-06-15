import { Router } from "@vaadin/router";
import "./router";
import "./pages/welcome";
import "./pages/chat";
import "./components/button/button";
import "./components/text-box/text-box";

window.addEventListener("load", () => {
  Router.go("/");
});

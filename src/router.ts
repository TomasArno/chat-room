import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
console.log("Soy el router");

router.setRoutes([
  { path: "/", component: "init-welcome" },
  { path: "/chat", component: "init-chat" },
]);

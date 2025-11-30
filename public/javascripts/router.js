import { state } from "./state.js";

const routes = ["auth", "dashboard", "cursus", "projets", "cluster", "annonces"];

export function renderRoute() {
  const hash = location.hash.replace("#/", "") || "auth";
  routes.forEach((r) => {
    document.getElementById(r).classList.toggle("hidden", r !== hash);
  });
  if (!state.user && hash !== "auth") location.hash = "#/auth";
}

window.addEventListener("hashchange", renderRoute);

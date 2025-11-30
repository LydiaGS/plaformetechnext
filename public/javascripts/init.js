import { renderRoute } from "./router.js";
import { initAuth } from "./auth.js";
import { hydrateDashboard } from "./dashboard.js";
import { renderCursus } from "./cursus.js";
import { renderProjects } from "./projects.js";
import { renderCluster } from "./cluster.js";
import { renderAnnouncements } from "./announcements.js";
import { startRealtime } from "./realtime.js";
import { state } from "./state.js";

function init() {
  renderRoute();
  initAuth();

  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#/", "");
    if (!state.user && hash !== "auth") return;
    if (hash === "dashboard") hydrateDashboard();
    if (hash === "cursus") renderCursus();
    if (hash === "projets") renderProjects();
    if (hash === "cluster") renderCluster();
    if (hash === "annonces") renderAnnouncements();
  });

  startRealtime();
}
init();
import { renderProjects } from "./projects.js";

function navigate(hash) {
  if (hash === "projets") renderProjects();
  // autres routes...
}

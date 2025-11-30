// Vérifie si l'utilisateur est connecté
const token = localStorage.getItem("token");
if (!token) {
  document.getElementById("dashboard").classList.add("hidden");
  alert("Connecte-toi pour voir ton dashboard !");
} else {
  document.getElementById("dashboard").classList.remove("hidden");

  // Charger les projets depuis l'API
  fetch("http://localhost:3000/projects", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(projects => {
      // Progression : calcule un pourcentage basé sur les projets évalués
      const completed = projects.filter(p => p.grade !== null).length;
      const percent = Math.round((completed / projects.length) * 100);

      document.querySelector("#progressBar span").style.width = percent + "%";
      document.getElementById("levelText").innerText = `Niveau ${percent}%`;

      // Notifications : liste les projets en attente
      const notifList = document.getElementById("notifications");
      notifList.innerHTML = "";
      projects.forEach(p => {
        if (p.status === "À évaluer") {
          const li = document.createElement("li");
          li.textContent = `Projet ${p.name} en attente d'évaluation`;
          notifList.appendChild(li);
        }
      });

      // Blackhole : exemple de compte à rebours fictif
      const deadline = new Date("2026-01-12"); // date du projet Libft
      const now = new Date();
      const diff = deadline - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      document.getElementById("blackholeCountdown").innerText = `${days} jours`;

      // Événements : exemple statique
      const eventsList = document.getElementById("events");
      eventsList.innerHTML = "<li>Hackathon 42</li><li>Évaluation Get Next Line</li>";
    })
    .catch(err => console.error("Erreur dashboard:", err));
}

import { state } from "./state.js";

export function hydrateDashboard() {
  const progressBar = document.querySelector("#progressBar span");
  progressBar.style.width = `${state.xpPercent}%`;
  document.getElementById("levelText").textContent = `Niveau ${state.level} · ${state.xpPercent}%`;

  const ul = document.getElementById("notifications");
  ul.innerHTML = "";
  state.notifications.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = n.text;
    ul.appendChild(li);
  });

  updateBlackholeCountdown();
  setInterval(updateBlackholeCountdown, 1000);

  const ev = document.getElementById("events");
  ev.innerHTML = "";
  state.events.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = `${e.title} — ${e.date}`;
    ev.appendChild(li);
  });
}

function updateBlackholeCountdown() {
  const now = Date.now();
  const diff = state.blackholeDate.getTime() - now;
  if (diff <= 0) return (document.getElementById("blackholeCountdown").textContent = "expiré");
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  document.getElementById("blackholeCountdown").textContent = `${days}j ${hours}h ${mins}m ${secs}s`;
}
// public/javascripts/projects.js
export async function renderProjects() {
  const tbody = document.getElementById("projectsTable");
  tbody.innerHTML = "";

  try {
    // 👉 Appel API Express
    const res = await fetch("http://localhost:3000/projects");
    const projects = await res.json();

    projects.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.deadline}</td>
        <td>${p.status}</td>
        <td>${p.grade ?? "—"}</td>
        <td>
          <button data-id="${p.id}" class="evalBtn">Évaluer</button>
          <button data-id="${p.id}" class="submitBtn">Déposer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erreur API projets:", err);
    tbody.innerHTML = "<tr><td colspan='5'>Impossible de charger les projets</td></tr>";
  }
}

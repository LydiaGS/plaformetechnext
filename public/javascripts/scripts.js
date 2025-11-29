// --- État global (mock) ---
const state = {
  user: null,
  notifications: [
    { id: 1, text: "Évaluation reçue pour 'Libft' (+92/100)" },
    { id: 2, text: "Nouvelle annonce: Hackathon dimanche" },
  ],
  blackholeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // +45 jours
  level: 4,
  xpPercent: 37,
  skills: ["Unix", "Git", "Algorithms", "C", "Teamwork"],
  projects: [
    { id: 1, name: "Libft", deadline: "2026-01-12", status: "En cours", grade: null },
    { id: 2, name: "Get Next Line", deadline: "2025-12-20", status: "À évaluer", grade: 85 },
    { id: 3, name: "Push Swap", deadline: "2026-02-05", status: "Assigné", grade: null },
  ],
  cluster: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: ["free", "busy", "down"][Math.floor(Math.random() * 3)],
  })),
  events: [
    { title: "Workshop Git", date: "2025-12-01" },
    { title: "Peer-eval night", date: "2025-12-05" },
  ],
  announcements: [
    { id: 1, title: "Ouverture campus dimanche", author: "Staff", date: "2025-11-29", body: "Le campus sera ouvert 10h–18h." },
    { id: 2, title: "Maintenance cluster B", author: "Infra", date: "2025-11-30", body: "Interruption 08h–09h." },
  ],
};

// --- Routing ---
const routes = ["auth", "dashboard", "cursus", "projets", "cluster", "annonces"];
function renderRoute() {
  const hash = location.hash.replace("#/", "") || "auth";
  routes.forEach((r) => {
    document.getElementById(r).classList.toggle("hidden", r !== hash);
  });
  // guard: si pas connecté, forcer auth
  if (!state.user && hash !== "auth") location.hash = "#/auth";
}
window.addEventListener("hashchange", renderRoute);

// --- Auth ---
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Connexion réussie !");
    location.hash = "#/dashboard";
  } else {
    alert("Erreur: " + data.error);
  }
});

// --- Dashboard ---
function hydrateDashboard() {
  // progression
  const progressBar = document.querySelector("#progressBar span");
  progressBar.style.width = `${state.xpPercent}%`;
  document.getElementById("levelText").textContent = `Niveau ${state.level} · ${state.xpPercent}%`;

  // notifications
  const ul = document.getElementById("notifications");
  ul.innerHTML = "";
  state.notifications.forEach((n) => {
    const li = document.createElement("li");
    li.textContent = n.text;
    ul.appendChild(li);
  });

  // blackhole countdown
  updateBlackholeCountdown();
  setInterval(updateBlackholeCountdown, 1000);

  // events
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

// --- Cursus graph (SVG simple) ---
function renderCursus() {
  const svg = document.getElementById("cursusGraph");
  svg.innerHTML = "";
  const nodes = [
    { id: "C Piscine", x: 70, y: 150 },
    { id: "Libft", x: 200, y: 120 },
    { id: "GNL", x: 320, y: 90 },
    { id: "Push Swap", x: 320, y: 180 },
    { id: "Exam Rank 02", x: 470, y: 140 },
  ];
  // edges
  const edges = [
    ["C Piscine", "Libft"],
    ["Libft", "GNL"],
    ["Libft", "Push Swap"],
    ["GNL", "Exam Rank 02"],
    ["Push Swap", "Exam Rank 02"],
  ];
  edges.forEach(([a, b]) => {
    const A = nodes.find((n) => n.id === a);
    const B = nodes.find((n) => n.id === b);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", A.x);
    line.setAttribute("y1", A.y);
    line.setAttribute("x2", B.x);
    line.setAttribute("y2", B.y);
    line.setAttribute("stroke", "#9ca3af");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  });
  nodes.forEach((n) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", n.x);
    circle.setAttribute("cy", n.y);
    circle.setAttribute("r", 22);
    circle.setAttribute("fill", "#2563eb");
    svg.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", n.x);
    text.setAttribute("y", n.y + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "10");
    text.textContent = n.id;
    svg.appendChild(text);
  });

  // skills chips
  const skills = document.getElementById("skills");
  skills.innerHTML = "";
  state.skills.forEach((s) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.textContent = s;
    skills.appendChild(c);
  });
}

// --- Projets & évaluations ---
function renderProjects() {
  const tbody = document.getElementById("projectsTable");
  tbody.innerHTML = "";
  state.projects.forEach((p) => {
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

  document.querySelectorAll(".evalBtn").forEach((btn) =>
    btn.addEventListener("click", () => openEvalDialog(btn.dataset.id))
  );
  document.querySelectorAll(".submitBtn").forEach((btn) =>
    btn.addEventListener("click", () => alert("Dépôt Git simulé. À brancher sur API GitLab/GitHub."))
  );

  document.getElementById("newProjectBtn").onclick = () => {
    const name = prompt("Nom du projet ?");
    if (!name) return;
    state.projects.push({ id: Date.now(), name, deadline: "2026-01-31", status: "Assigné", grade: null });
    renderProjects();
  };
  document.getElementById("syncGitBtn").onclick = () => alert("Sync Git simulée (webhook/API).");
}

function openEvalDialog(projectId) {
  const dlg = document.getElementById("evalDialog");
  dlg.showModal();
  document.getElementById("submitEval").onclick = () => {
    const score = parseInt(document.getElementById("score").value || "0", 10);
    const rubric = document.getElementById("rubric").value.trim();
    const p = state.projects.find((x) => x.id == projectId);
    p.grade = score;
    state.notifications.unshift({ id: Date.now(), text: `Évaluation ${p.name}: ${score}/100` });
    dlg.close();
    renderProjects();
    hydrateDashboard();
    alert(`Évaluation enregistrée.\nRubrique: ${rubric}`);
  };
}

// --- Cluster & présence ---
function renderCluster() {
  const grid = document.getElementById("clusterGrid");
  grid.innerHTML = "";
  state.cluster.forEach((n) => {
    const div = document.createElement("div");
    div.className = `node ${n.status}`;
    div.textContent = n.id;
    grid.appendChild(div);
  });
  // Simule présence temps réel
  setInterval(() => {
    const i = Math.floor(Math.random() * state.cluster.length);
    state.cluster[i].status = ["free", "busy", "down"][Math.floor(Math.random() * 3)];
    const nodes = document.querySelectorAll(".node");
    nodes[i].className = `node ${state.cluster[i].status}`;
  }, 2000);
}

// --- Annonces ---
function renderAnnouncements() {
  const ul = document.getElementById("announcements");
  ul.innerHTML = "";
  state.announcements.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="title">${a.title}</div>
      <div class="meta">${a.author} · ${a.date}</div>
      <div>${a.body}</div>`;
    ul.appendChild(li);
  });

  document.getElementById("searchAnnouncements").oninput = (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = state.announcements.filter(
      (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q)
    );
    const ul2 = document.getElementById("announcements");
    ul2.innerHTML = "";
    filtered.forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="title">${a.title}</div>
        <div class="meta">${a.author} · ${a.date}</div>
        <div>${a.body}</div>`;
      ul2.appendChild(li);
    });
  };

  document.getElementById("newAnnouncementBtn").onclick = () => {
    const title = prompt("Titre de l’annonce ?");
    const body = prompt("Contenu ?");
    if (!title || !body) return;
    state.announcements.unshift({
      id: Date.now(),
      title,
      body,
      author: state.user?.role === "staff" ? "Staff" : "Étudiant",
      date: new Date().toISOString().slice(0, 10),
    });
    renderAnnouncements();
  };
}

// --- Simuler notifications temps réel (WebSocket placeholder) ---
function startRealtime() {
  // Ici tu brancheras un vrai WebSocket: const ws = new WebSocket("wss://api.campus/ws");
  // Démo: push auto toutes 15s
  setInterval(() => {
    const msg = ["Nouvelle évaluation disponible", "Deadline dans 24h", "Mise à jour du cluster"][Math.floor(Math.random() * 3)];
    state.notifications.unshift({ id: Date.now(), text: msg });
    if (location.hash === "#/dashboard") hydrateDashboard();
  }, 15000);
}

// --- Init ---
function init() {
  renderRoute();
  // Préparer composants pour navigation
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
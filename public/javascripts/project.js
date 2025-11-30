export async function renderProjects() {
  const tbody = document.getElementById("projectsTable");
  tbody.innerHTML = "";

  try {
    // 👉 Récupère le token stocké après login
    const token = localStorage.getItem("token");

    // 👉 Appel API Express avec Authorization
    const res = await fetch("http://localhost:3000/projects", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json();
      tbody.innerHTML = `<tr><td colspan='5'>Erreur : ${err.error}</td></tr>`;
      return;
    }

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

    // Exemple d’action sur bouton "Nouveau projet"
    document.getElementById("newProjectBtn").onclick = async () => {
      const name = prompt("Nom du projet ?");
      if (!name) return;

      // 👉 Envoi au serveur (POST) avec Authorization
      await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          deadline: "2026-01-31",
          status: "Assigné",
          grade: null,
        }),
      });

      // Recharge la liste
      renderProjects();
    };

  } catch (err) {
    console.error("Erreur API projets:", err);
    tbody.innerHTML = "<tr><td colspan='5'>Impossible de charger les projets</td></tr>";
  }
}
